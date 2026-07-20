import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser, JwtPayload } from './auth.types';
import { generateRefreshToken, hashToken } from './auth.utils';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UpdateProfileDto } from './dto/profile.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, response: Response) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const userCount = await this.prisma.user.count();
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name?.trim() || null,
        role: userCount === 0 ? 'ADMIN' : 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        linkedinUrl: true,
        createdAt: true,
      },
    });

    await this.issueAuthTokens(user, response);

    return {
      user,
      message: 'Registration successful',
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

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      linkedinUrl: user.linkedinUrl,
      createdAt: user.createdAt,
    };

    await this.issueAuthTokens(safeUser, response);

    return {
      user: safeUser,
      message: 'Login successful',
    };
  }

  async logout(userId: string, refreshToken: string | undefined, response: Response) {
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
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
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
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        linkedinUrl: true,
        createdAt: true,
      },
    });

    return { user: profile };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        linkedinUrl: dto.linkedinUrl?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        linkedinUrl: true,
        createdAt: true,
      },
    });

    return { user: updated, message: 'Profile updated' };
  }

  private async issueAuthTokens(
    user: {
      id: string;
      email: string;
      name: string | null;
      role: string;
    },
    response: Response,
  ) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') as `${number}${'s' | 'm' | 'h' | 'd'}`,
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

    const secure = this.configService.get<string>('COOKIE_SECURE') === 'true';

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
