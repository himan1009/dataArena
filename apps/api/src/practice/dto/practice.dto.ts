import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import {
  PracticeContentStatus,
  PracticeDifficulty,
  PracticePlatform,
} from '@prisma/client';

export class UpsertPracticeCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsEnum(PracticeContentStatus)
  status?: PracticeContentStatus;
}

export class UpsertPracticeTopicDto {
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsEnum(PracticeContentStatus)
  status?: PracticeContentStatus;
}

export class UpsertPracticeSubtopicDto {
  @IsString()
  @IsNotEmpty()
  topicId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  slug!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsEnum(PracticeContentStatus)
  status?: PracticeContentStatus;
}

export class CreatePracticeQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsEnum(PracticePlatform)
  platform!: PracticePlatform;

  @IsUrl()
  questionUrl!: string;

  @IsEnum(PracticeDifficulty)
  difficulty!: PracticeDifficulty;

  @IsString()
  @IsNotEmpty()
  topicId!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  @IsString()
  subtopicId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  companyTags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(60)
  estimatedTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdatePracticeQuestionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsEnum(PracticePlatform)
  platform?: PracticePlatform;

  @IsOptional()
  @IsUrl()
  questionUrl?: string;

  @IsOptional()
  @IsEnum(PracticeDifficulty)
  difficulty?: PracticeDifficulty;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  topicId?: string;

  @IsOptional()
  @IsString()
  subtopicId?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  companyTags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(60)
  estimatedTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class ReviewPracticeQuestionDto {
  @IsIn(['approve', 'reject'])
  action!: 'approve' | 'reject';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}

export class UpdateQuestionUploadPermissionDto {
  @IsOptional()
  canUploadQuestions?: boolean;
}
