import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserRoleDto, UpdateUserStatusDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        linkedinUrl: true,
        isActive: true,
        deactivatedAt: true,
        createdAt: true,
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });
  }

  async updateUserRole(
    adminId: string,
    userId: string,
    dto: UpdateUserRoleDto,
  ) {
    if (adminId === userId) {
      throw new ForbiddenException('You cannot change your own role');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Role.ADMIN && dto.role !== Role.ADMIN) {
      throw new ForbiddenException('Cannot change the role of another admin');
    }

    if (dto.role === Role.ADMIN) {
      throw new ForbiddenException(
        'Promoting users to admin is not allowed from this panel',
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    return { user: updated, message: 'Role updated' };
  }

  async updateUserStatus(
    adminId: string,
    userId: string,
    dto: UpdateUserStatusDto,
  ) {
    if (adminId === userId) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Role.ADMIN && !dto.isActive) {
      throw new ForbiddenException('Cannot deactivate another admin');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.user.update({
        where: { id: userId },
        data: {
          isActive: dto.isActive,
          deactivatedAt: dto.isActive ? null : new Date(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          deactivatedAt: true,
        },
      });

      if (!dto.isActive) {
        await tx.refreshToken.updateMany({
          where: { userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }

      return result;
    });

    return {
      user: updated,
      message: dto.isActive ? 'User reactivated' : 'User deactivated',
    };
  }
}
