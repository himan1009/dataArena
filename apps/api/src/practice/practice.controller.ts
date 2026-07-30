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

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  CreatePracticeQuestionDto,
  ReviewPracticeQuestionDto,
  UpdatePracticeQuestionDto,
  UpsertPracticeCategoryDto,
  UpsertPracticeSubtopicDto,
  UpsertPracticeTopicDto,
} from './dto/practice.dto';
import { PracticeService } from './practice.service';

@Controller('practice')
@UseGuards(JwtAuthGuard)
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Public()
  @Get('categories')
  listCategories() {
    return this.practiceService.listPublicCategories();
  }

  @Public()
  @Get('categories/:categorySlug')
  getCategory(@Param('categorySlug') categorySlug: string) {
    return this.practiceService.getPublicCategoryBySlug(categorySlug);
  }

  @Public()
  @Get('categories/:categorySlug/topics/:topicSlug')
  getTopic(
    @Param('categorySlug') categorySlug: string,
    @Param('topicSlug') topicSlug: string,
  ) {
    return this.practiceService.getPublicTopicBySlug(categorySlug, topicSlug);
  }

  @Public()
  @Get('questions')
  listQuestions(
    @Query('categoryId') categoryId?: string,
    @Query('topicId') topicId?: string,
    @Query('subtopicId') subtopicId?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.practiceService.listPublishedQuestions({
      categoryId,
      topicId,
      subtopicId,
      difficulty,
    });
  }

  @Get('taxonomy')
  listTaxonomyForEditors() {
    return this.practiceService.listTaxonomyForEditors();
  }

  @Get('mine/questions')
  listMine(@CurrentUser() user: AuthenticatedUser) {
    return this.practiceService.listMine(user.id);
  }

  @Post('mine/questions')
  createMine(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePracticeQuestionDto,
  ) {
    return this.practiceService.createQuestion(user.id, user.role, dto, false);
  }

  @Post('mine/questions/submit')
  createAndSubmitMine(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePracticeQuestionDto,
  ) {
    return this.practiceService.createQuestion(user.id, user.role, dto, true);
  }

  @Patch('mine/questions/:id')
  updateMine(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePracticeQuestionDto,
  ) {
    return this.practiceService.updateQuestion(id, user.id, user.role, dto);
  }

  @Post('mine/questions/:id/submit')
  submitMine(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.practiceService.submitQuestion(id, user.id, user.role);
  }

  @Delete('mine/questions/:id')
  deleteMine(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.practiceService.deleteQuestion(id, user.id, user.role);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminStats() {
    return this.practiceService.adminStats();
  }

  @Get('admin/review-queue')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminReviewQueue() {
    return this.practiceService.adminReviewQueue();
  }

  @Post('admin/questions/:id/review')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminReview(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReviewPracticeQuestionDto,
  ) {
    return this.practiceService.adminReview(id, user.id, dto);
  }

  @Patch('admin/questions/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminUpdateQuestion(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePracticeQuestionDto,
  ) {
    return this.practiceService.updateQuestion(id, user.id, user.role, dto, true);
  }

  @Delete('admin/questions/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminDeleteQuestion(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.practiceService.deleteQuestion(id, user.id, user.role, true);
  }

  @Get('admin/categories')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminListCategories() {
    return this.practiceService.adminListCategories();
  }

  @Post('admin/categories')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createCategory(@Body() dto: UpsertPracticeCategoryDto) {
    return this.practiceService.createCategory(dto);
  }

  @Patch('admin/categories/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateCategory(@Param('id') id: string, @Body() dto: UpsertPracticeCategoryDto) {
    return this.practiceService.updateCategory(id, dto);
  }

  @Delete('admin/categories/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteCategory(@Param('id') id: string) {
    return this.practiceService.deleteCategory(id);
  }

  @Post('admin/topics')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createTopic(@Body() dto: UpsertPracticeTopicDto) {
    return this.practiceService.createTopic(dto);
  }

  @Patch('admin/topics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateTopic(@Param('id') id: string, @Body() dto: UpsertPracticeTopicDto) {
    return this.practiceService.updateTopic(id, dto);
  }

  @Delete('admin/topics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteTopic(@Param('id') id: string) {
    return this.practiceService.deleteTopic(id);
  }

  @Post('admin/subtopics')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createSubtopic(@Body() dto: UpsertPracticeSubtopicDto) {
    return this.practiceService.createSubtopic(dto);
  }

  @Patch('admin/subtopics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateSubtopic(@Param('id') id: string, @Body() dto: UpsertPracticeSubtopicDto) {
    return this.practiceService.updateSubtopic(id, dto);
  }

  @Delete('admin/subtopics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteSubtopic(@Param('id') id: string) {
    return this.practiceService.deleteSubtopic(id);
  }
}
