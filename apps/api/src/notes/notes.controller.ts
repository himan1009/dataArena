import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  CreateAuthorArticleDto,
  ReviewArticleDto,
  UpdateAuthorArticleDto,
} from './dto/author.dto';
import {
  CreateArticleDto,
  CreateCategoryDto,
  CreateTopicDto,
  UpdateArticleDto,
  UpdateCategoryDto,
  UpdateTopicDto,
} from './dto/notes.dto';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('author/topics/available')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  listAvailableTopics(@CurrentUser() user: AuthenticatedUser) {
    return this.notesService.listAvailableTopics(user.id);
  }

  @Get('author/articles')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  listMyArticles(@CurrentUser() user: AuthenticatedUser) {
    return this.notesService.listMyArticles(user.id);
  }

  @Get('author/articles/:id')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  getAuthorArticle(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.notesService.getAuthorArticle(id, user.id);
  }

  @Post('author/articles')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  createAuthorArticle(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAuthorArticleDto,
  ) {
    return this.notesService.createAuthorArticle(user.id, dto);
  }

  @Patch('author/articles/:id')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  updateAuthorArticle(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateAuthorArticleDto,
  ) {
    return this.notesService.updateAuthorArticle(id, user.id, dto);
  }

  @Post('author/articles/:id/submit')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  submitAuthorArticle(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.notesService.submitAuthorArticle(id, user.id);
  }

  @Get('admin/review-queue')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getReviewQueue() {
    return this.notesService.getReviewQueue();
  }

  @Post('admin/articles/:id/review')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  reviewArticle(@Param('id') id: string, @Body() dto: ReviewArticleDto) {
    return this.notesService.reviewArticle(id, dto);
  }

  @Get('categories')
  listCategories() {
    return this.notesService.listCategories();
  }

  @Get('categories/:categorySlug')
  getCategory(@Param('categorySlug') categorySlug: string) {
    return this.notesService.getCategoryBySlug(categorySlug);
  }

  @Get('categories/:categorySlug/topics/:topicSlug')
  getTopic(
    @Param('categorySlug') categorySlug: string,
    @Param('topicSlug') topicSlug: string,
  ) {
    return this.notesService.getTopicBySlug(categorySlug, topicSlug);
  }

  @Get('categories/:categorySlug/topics/:topicSlug/articles/:articleSlug')
  getArticle(
    @Param('categorySlug') categorySlug: string,
    @Param('topicSlug') topicSlug: string,
    @Param('articleSlug') articleSlug: string,
  ) {
    return this.notesService.getArticleBySlug(
      categorySlug,
      topicSlug,
      articleSlug,
    );
  }

  @Get('admin/categories')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminListCategories() {
    return this.notesService.adminListCategories();
  }

  @Post('admin/categories')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.notesService.createCategory(dto);
  }

  @Patch('admin/categories/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.notesService.updateCategory(id, dto);
  }

  @Delete('admin/categories/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteCategory(@Param('id') id: string) {
    return this.notesService.deleteCategory(id);
  }

  @Post('admin/topics')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createTopic(@Body() dto: CreateTopicDto) {
    return this.notesService.createTopic(dto);
  }

  @Patch('admin/topics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateTopic(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.notesService.updateTopic(id, dto);
  }

  @Delete('admin/topics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteTopic(@Param('id') id: string) {
    return this.notesService.deleteTopic(id);
  }

  @Post('admin/articles')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createArticle(@Body() dto: CreateArticleDto) {
    return this.notesService.createArticle(dto);
  }

  @Patch('admin/articles/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateArticle(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.notesService.updateArticle(id, dto);
  }

  @Delete('admin/articles/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteArticle(@Param('id') id: string) {
    return this.notesService.deleteArticle(id);
  }
}
