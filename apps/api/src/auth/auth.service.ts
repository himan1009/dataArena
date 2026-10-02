import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';

import { BrevoMailService } from '../email/brevo-mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { publicUserSelect, type PublicUser } from './auth-user.select';
import { AuthenticatedUser, JwtPayload } from './auth.types';
import {
  generateActionToken,
  generateRefreshToken,
  hashToken,
} from './auth.utils';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { UpdateProfileDto } from './dto/profile.dto';

const BCRYPT_ROUNDS = 12;
const VERIFY_TOKEN_HOURS = 48;
const RESET_TOKEN_HOURS = 1;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mail: BrevoMailService,
  ) {}

  async register(dto: RegisterDto, response: Response) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const userCount = await this.prisma.user.count();
    const isBootstrapAdmin = userCount === 0;
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name?.trim() || null,
        role: isBootstrapAdmin ? 'ADMIN' : 'USER',
        emailVerified: isBootstrapAdmin,
      },
      select: publicUserSelect,
    });

    await this.issueAuthTokens(user, response);

    let verificationMessage =
      'Registration successful. Check your email to verify your address.';

    if (!isBootstrapAdmin) {
      const emailSent = await this.trySendVerificationEmail(
        user.id,
        user.email,
        user.name,
      );
      if (!emailSent) {
        verificationMessage =
          'Registration successful. We could not send the verification email — open Settings and use “Resend verification email”.';
      }
    }

    return {
      user,
      message: isBootstrapAdmin
        ? 'Registration successful.'
        : verificationMessage,
    };
  }

  async login(dto: LoginDto, response: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'This account has been deactivated. Contact the admin if you need access.',
      );
    }

    const safeUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: publicUserSelect,
    });

    if (!safeUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.issueAuthTokens(safeUser, response);

    return {
      user: safeUser,
      message: 'Login successful',
    };
  }

  async logout(
    userId: string,
    refreshToken: string | undefined,
    response: Response,
  ) {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: {
          userId,
          tokenHash,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }

    this.clearAuthCookies(response);

    return { message: 'Logout successful' };
  }

  async refresh(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: publicUserSelect,
        },
      },
    });

    if (!storedToken) {
      this.clearAuthCookies(response);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    await this.issueAuthTokens(storedToken.user, response);

    return {
      user: storedToken.user,
      message: 'Token refreshed',
    };
  }

  async getProfile(user: AuthenticatedUser) {
    const profile = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: publicUserSelect,
    });

    return { user: profile };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        linkedinUrl: dto.linkedinUrl?.trim() || null,
      },
      select: publicUserSelect,
    });

    return { user: updated, message: 'Profile updated' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: { id: true, email: true, name: true, isActive: true },
    });

    if (user?.isActive) {
      const rawToken = generateActionToken();
      const expiresAt = new Date(
        Date.now() + RESET_TOKEN_HOURS * 60 * 60 * 1000,
      );

      await this.prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      });

      const tokenRecord = await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(rawToken),
          expiresAt,
        },
      });

      const resetUrl = `${this.mail.getFrontendUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;

      try {
        await this.mail.sendEmail({
          to: user.email,
          subject: 'Reset your DataArena password',
          html: this.buildEmailHtml({
            title: 'Reset your password',
            greeting: user.name ? `Hi ${escapeHtml(user.name)},` : 'Hi,',
            body: [
              'We received a request to reset your DataArena password.',
              'This link expires in 1 hour. If you did not request a reset, you can ignore this email.',
            ],
            actionLabel: 'Reset password',
            actionUrl: resetUrl,
          }),
        });
      } catch (error) {
        await this.prisma.passwordResetToken.delete({
          where: { id: tokenRecord.id },
        });
        this.logger.error(
          `Password reset email failed for ${user.email}: ${String(error)}`,
        );
      }
    }

    return {
      message:
        'If an account exists for that email, we sent password reset instructions.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = hashToken(dto.token);
    const record = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: { select: { id: true, isActive: true } },
      },
    });

    if (!record || !record.user.isActive) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.updateMany({
        where: { userId: record.userId, usedAt: null },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password updated. You can sign in with your new password.' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const tokenHash = hashToken(dto.token);
    const record = await this.prisma.emailVerificationToken.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: { select: { id: true, emailVerified: true } },
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    if (!record.user.emailVerified) {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: record.userId },
          data: { emailVerified: true },
        }),
        this.prisma.emailVerificationToken.deleteMany({
          where: { userId: record.userId },
        }),
      ]);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: record.userId },
      select: publicUserSelect,
    });

    return {
      message: 'Email verified successfully.',
      user,
    };
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account not found');
    }

    if (user.emailVerified) {
      return { message: 'Your email is already verified.' };
    }

    const emailSent = await this.trySendVerificationEmail(
      user.id,
      user.email,
      user.name,
    );

    if (!emailSent) {
      throw new BadRequestException(
        'Could not send verification email. Try again in a few minutes or contact support.',
      );
    }

    return {
      message: 'Verification email sent. Check your inbox and spam folder.',
    };
  }

  private async trySendVerificationEmail(
    userId: string,
    email: string,
    name: string | null,
  ): Promise<boolean> {
    try {
      await this.issueAndSendVerificationEmail(userId, email, name);
      return true;
    } catch (error) {
      this.logger.error(
        `Verification email failed for ${email}: ${String(error)}`,
      );
      return false;
    }
  }

  private async issueAndSendVerificationEmail(
    userId: string,
    email: string,
    name: string | null,
  ) {
    const rawToken = generateActionToken();
    const expiresAt = new Date(
      Date.now() + VERIFY_TOKEN_HOURS * 60 * 60 * 1000,
    );

    await this.prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });

    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash: hashToken(rawToken),
        expiresAt,
      },
    });

    const verifyUrl = `${this.mail.getFrontendUrl()}/verify-email?token=${encodeURIComponent(rawToken)}`;

    await this.mail.sendEmail({
      to: email,
      subject: 'Verify your DataArena email',
      html: this.buildEmailHtml({
        title: 'Verify your email',
        greeting: name ? `Hi ${escapeHtml(name)},` : 'Hi,',
        body: [
          'Thanks for joining DataArena. Please confirm this email address belongs to you.',
          `This link expires in ${VERIFY_TOKEN_HOURS} hours.`,
        ],
        actionLabel: 'Verify email',
        actionUrl: verifyUrl,
      }),
    });
  }

  private buildEmailHtml({
    title,
    greeting,
    body,
    actionLabel,
    actionUrl,
  }: {
    title: string;
    greeting: string;
    body: string[];
    actionLabel: string;
    actionUrl: string;
  }) {
    const paragraphs = body.map((line) => `<p style="margin:0 0 16px;line-height:1.6;color:#334155;">${line}</p>`).join('');

    return `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
        <h1 style="font-size:20px;margin:0 0 12px;color:#0f172a;">${title}</h1>
        <p style="margin:0 0 16px;line-height:1.6;color:#334155;">${greeting}</p>
        ${paragraphs}
        <p style="margin:24px 0;">
          <a href="${actionUrl}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600;">${actionLabel}</a>
        </p>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#64748b;">If the button does not work, copy this link:<br/><a href="${actionUrl}" style="color:#6366f1;">${actionUrl}</a></p>
      </div>
    `;
  }

  private async issueAuthTokens(user: PublicUser, response: Response) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_EXPIRES_IN',
        '15m',
      ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
    });

    const refreshToken = generateRefreshToken();
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );

    const refreshExpiresMs = this.parseDurationToMs(refreshExpiresIn);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshExpiresMs),
      },
    });

    const secure =
      this.configService.get<string>('COOKIE_SECURE') === 'true' ||
      this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: this.parseDurationToMs(
        this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      ),
      path: '/',
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: refreshExpiresMs,
      path: '/',
    });
  }

  private clearAuthCookies(response: Response) {
    response.clearCookie('access_token', { path: '/' });
    response.clearCookie('refresh_token', { path: '/' });
  }

  private parseDurationToMs(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }
}
