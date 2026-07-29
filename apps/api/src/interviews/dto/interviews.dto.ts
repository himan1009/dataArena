import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ExperienceLevel,
  InterviewExperienceStatus,
  InterviewReportReason,
  InterviewResult,
  InterviewRoundType,
  RoleLevel,
} from '@prisma/client';

export class InterviewRoundDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(InterviewRoundType)
  roundType!: InterviewRoundType;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsIn(['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'])
  difficulty?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  questionsAsked!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  candidateExperience!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  outcome?: string;
}

export class CreateInterviewExperienceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  company!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  role!: string;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  yearsOfExperience!: string;

  @IsEnum(RoleLevel)
  roleLevel!: RoleLevel;

  @IsInt()
  @Min(2000)
  @Max(2100)
  interviewYear!: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsEnum(InterviewResult)
  result!: InterviewResult;

  @IsString()
  @MaxLength(20000)
  overview!: string;

  @IsString()
  @MaxLength(20000)
  preparationTips!: string;

  @IsString()
  @MaxLength(20000)
  finalAdvice!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterviewRoundDto)
  rounds!: InterviewRoundDto[];
}

export class UpdateInterviewExperienceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  company?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  role?: string;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  yearsOfExperience?: string;

  @IsOptional()
  @IsEnum(RoleLevel)
  roleLevel?: RoleLevel;

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  interviewYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @IsEnum(InterviewResult)
  result?: InterviewResult;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  overview?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  preparationTips?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  finalAdvice?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterviewRoundDto)
  rounds?: InterviewRoundDto[];
}

export class ReviewInterviewExperienceDto {
  @IsIn(['approve', 'reject', 'request_changes'])
  action!: 'approve' | 'reject' | 'request_changes';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}

export class ReportInterviewExperienceDto {
  @IsEnum(InterviewReportReason)
  reason!: InterviewReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  details?: string;
}

export class ListInterviewExperiencesQuery {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsEnum(RoleLevel)
  roleLevel?: RoleLevel;
}

export { InterviewExperienceStatus };
