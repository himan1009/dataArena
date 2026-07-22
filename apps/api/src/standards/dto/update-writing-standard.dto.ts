import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateWritingStandardDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(100000)
  content?: string;
}
