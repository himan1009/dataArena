import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserRoleDto, UpdateUserStatusDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async listUsers() {
    const users = await this.usersService.listUsers();

    return {
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        linkedinUrl: user.linkedinUrl,
        isActive: user.isActive,
        deactivatedAt: user.deactivatedAt,
        createdAt: user.createdAt,
        publishedArticleCount: user._count.articles,
      })),
    };
  }

  @Patch(':id/role')
  updateRole(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRole(admin.id, userId, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateUserStatus(admin.id, userId, dto);
  }
}
