import { IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @ValidateIf((dto: UpdateProfileDto) => dto.linkedinUrl !== '')
  @IsString()
  @IsUrl({}, { message: 'LinkedIn URL must be a valid URL' })
  linkedinUrl?: string;
}
