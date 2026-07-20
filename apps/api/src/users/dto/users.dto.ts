import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  isActive!: boolean;
}
