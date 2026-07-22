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
import { Role } from '@prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  AssignEditorDto,
  CreateAuthorArticleDto,
  ReviewArticleDto,
  ReviewEditRequestDto,
  RequestEditAccessDto,
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
    return this.notesService.updateAuthorArticle(id, user.id, dto, {
      id: user.id,
      role: user.role as Role,
    });
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

  @Post('author/articles/:id/request-edit')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  requestEditAccess(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RequestEditAccessDto,
  ) {
    return this.notesService.requestEditAccess(id, user.id, dto);
  }

  @Get('author/editors')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  listAuthorEditors() {
    return this.notesService.listAuthorEditors();
  }

  @Delete('author/articles/:id')
  @UseGuards(RolesGuard)
  @Roles('EDITOR', 'ADMIN')
  deleteAuthorArticle(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.notesService.deleteAuthorArticle(
      id,
      user.id,
      user.role as Role,
    );
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

  @Get('admin/editors')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listAdminEditors() {
    return this.notesService.listAuthorEditors();
  }

  @Get('admin/edit-requests')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getEditRequestQueue() {
    return this.notesService.getEditRequestQueue();
  }

  @Post('admin/articles/:id/edit-request/review')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  reviewEditRequest(
    @Param('id') id: string,
    @Body() dto: ReviewEditRequestDto,
  ) {
    return this.notesService.reviewEditRequest(id, dto);
  }

  @Post('admin/articles/:id/assign-editor')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  assignEditor(@Param('id') id: string, @Body() dto: AssignEditorDto) {
    return this.notesService.assignEditorToArticle(id, dto);
  }

  @Get('categories')
  @Public()
  listCategories() {
    return this.notesService.listCategories();
  }

  @Get('categories/:categorySlug')
  @Public()
  getCategory(@Param('categorySlug') categorySlug: string) {
    return this.notesService.getCategoryBySlug(categorySlug);
  }

  @Get('categories/:categorySlug/topics/:topicSlug')
  @Public()
  getTopic(
    @Param('categorySlug') categorySlug: string,
    @Param('topicSlug') topicSlug: string,
  ) {
    return this.notesService.getTopicBySlug(categorySlug, topicSlug);
  }

  @Get('categories/:categorySlug/topics/:topicSlug/articles/:articleSlug')
  @Public()
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

  @Get('admin/articles/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAdminArticle(@Param('id') id: string) {
    return this.notesService.getAdminArticle(id);
  }

  @Patch('admin/articles/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateArticle(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.notesService.updateArticle(id, dto, {
      id: user.id,
      role: user.role as Role,
    });
  }

  @Delete('admin/articles/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteArticle(@Param('id') id: string) {
    return this.notesService.deleteArticle(id);
  }
}
