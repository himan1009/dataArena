import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  CreateInterviewExperienceDto,
  ReportInterviewExperienceDto,
  ReviewInterviewExperienceDto,
  UpdateInterviewExperienceDto,
  UpdateInterviewReportStatusDto,
} from './dto/interviews.dto';
import { InterviewsService } from './interviews.service';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Public()
  @Get()
  listPublished(
    @Query('q') q?: string,
    @Query('company') company?: string,
    @Query('role') role?: string,
    @Query('experienceLevel') experienceLevel?: string,
    @Query('roleLevel') roleLevel?: string,
  ) {
    return this.interviewsService.listPublished({
      q,
      company,
      role,
      experienceLevel,
      roleLevel,
    });
  }

  @Public()
  @Get('slug/:slug')
  getPublishedBySlug(@Param('slug') slug: string) {
    return this.interviewsService.getPublishedBySlug(slug);
  }

  @Get('mine')
  listMine(@CurrentUser() user: AuthenticatedUser) {
    return this.interviewsService.listMine(user.id);
  }

  @Get('mine/:id')
  getMine(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.interviewsService.getMine(id, user.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateInterviewExperienceDto,
  ) {
    return this.interviewsService.create(user.id, dto);
  }

  @Patch('mine/:id')
  updateMine(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateInterviewExperienceDto,
  ) {
    return this.interviewsService.update(id, user.id, dto);
  }

  @Post('mine/:id/submit')
  submitMine(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.interviewsService.submit(id, user.id);
  }

  @Delete('mine/:id')
  deleteMine(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.interviewsService.deleteMine(id, user.id);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('slug/:slug/report')
  report(@Param('slug') slug: string, @Body() dto: ReportInterviewExperienceDto) {
    return this.interviewsService.report(slug, null, dto);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminStats() {
    return this.interviewsService.adminStats();
  }

  @Get('admin/review-queue')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminReviewQueue() {
    return this.interviewsService.adminReviewQueue();
  }

  @Get('admin/experiences/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminGet(@Param('id') id: string) {
    return this.interviewsService.adminGet(id);
  }

  @Post('admin/experiences/:id/review')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminReview(
    @Param('id') id: string,
    @Body() dto: ReviewInterviewExperienceDto,
  ) {
    return this.interviewsService.adminReview(id, dto);
  }

  @Delete('admin/experiences/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminDelete(@Param('id') id: string) {
    return this.interviewsService.adminDelete(id);
  }

  @Get('admin/reports')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminListReports() {
    return this.interviewsService.adminListReports();
  }

  @Patch('admin/reports/:id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminUpdateReportStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInterviewReportStatusDto,
  ) {
    return this.interviewsService.adminUpdateReportStatus(id, dto);
  }
}
