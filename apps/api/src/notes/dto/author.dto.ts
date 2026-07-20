import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'LinkedIn URL must be a valid URL' })
  linkedinUrl?: string;
}

export class CreateAuthorArticleDto {
  @IsString()
  @IsNotEmpty()
  topicId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateAuthorArticleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

export enum ReviewAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  REQUEST_CHANGES = 'request_changes',
}

export class ReviewArticleDto {
  @IsEnum(ReviewAction)
  action!: ReviewAction;

  @IsOptional()
  @IsString()
  comment?: string;
}
