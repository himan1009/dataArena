import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateAuthorArticleDto {
  @IsString()
  @IsNotEmpty()
  topicId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500000)
  content!: string;
}

export class UpdateAuthorArticleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500000)
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
  @MaxLength(5000)
  comment?: string;
}

export enum EditRequestReviewAction {
  APPROVE = 'approve',
  REJECT = 'reject',
}

export class RequestEditAccessDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  note!: string;
}

export class ReviewEditRequestDto {
  @IsEnum(EditRequestReviewAction)
  action!: EditRequestReviewAction;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comment?: string;

  @ValidateIf(
    (dto: ReviewEditRequestDto) =>
      dto.action === EditRequestReviewAction.APPROVE,
  )
  @IsString()
  @IsNotEmpty()
  assigneeId?: string;
}

export class AssignEditorDto {
  @IsString()
  @IsNotEmpty()
  assigneeId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comment?: string;
}
