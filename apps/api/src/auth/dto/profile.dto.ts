import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'LinkedIn URL must be a valid URL' })
  linkedinUrl?: string;
}
