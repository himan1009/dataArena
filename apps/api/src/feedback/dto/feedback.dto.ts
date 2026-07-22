import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

import { FeedbackStatus } from '@prisma/client';

export class CreateContactMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string;
}

export class CreateBugReportDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  area!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @IsUrl(
    { require_protocol: true },
    { message: 'Page URL must be http or https' },
  )
  pageUrl?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string;
}

export class UpdateFeedbackStatusDto {
  @IsEnum(FeedbackStatus)
  status!: FeedbackStatus;
}
