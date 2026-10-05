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

import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  UpsertShortSubtopicDto,
  UpsertShortTopicDto,
  UpsertShortVideoDto,
} from './shorts.dto';
import { ShortsService } from './shorts.service';

@Controller('shorts')
@UseGuards(JwtAuthGuard)
export class ShortsController {
  constructor(private readonly shortsService: ShortsService) {}

  @Public()
  @Get('topics')
  listTopics() {
    return this.shortsService.listPublicTopics();
  }

  @Public()
  @Get('topics/:topicSlug')
  getTopic(@Param('topicSlug') topicSlug: string) {
    return this.shortsService.getPublicTopicBySlug(topicSlug);
  }

  @Public()
  @Get('topics/:topicSlug/subtopics/:subtopicSlug')
  getSubtopic(
    @Param('topicSlug') topicSlug: string,
    @Param('subtopicSlug') subtopicSlug: string,
  ) {
    return this.shortsService.getPublicSubtopicBySlug(topicSlug, subtopicSlug);
  }

  @Get('admin/topics')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminListTopics() {
    return this.shortsService.adminListTopics();
  }

  @Post('admin/topics')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createTopic(@Body() dto: UpsertShortTopicDto) {
    return this.shortsService.createTopic(dto);
  }

  @Patch('admin/topics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateTopic(@Param('id') id: string, @Body() dto: UpsertShortTopicDto) {
    return this.shortsService.updateTopic(id, dto);
  }

  @Delete('admin/topics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteTopic(@Param('id') id: string) {
    return this.shortsService.deleteTopic(id);
  }

  @Post('admin/subtopics')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createSubtopic(@Body() dto: UpsertShortSubtopicDto) {
    return this.shortsService.createSubtopic(dto);
  }

  @Patch('admin/subtopics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateSubtopic(@Param('id') id: string, @Body() dto: UpsertShortSubtopicDto) {
    return this.shortsService.updateSubtopic(id, dto);
  }

  @Delete('admin/subtopics/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteSubtopic(@Param('id') id: string) {
    return this.shortsService.deleteSubtopic(id);
  }

  @Post('admin/videos')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createVideo(@Body() dto: UpsertShortVideoDto) {
    return this.shortsService.createVideo(dto);
  }

  @Patch('admin/videos/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateVideo(@Param('id') id: string, @Body() dto: UpsertShortVideoDto) {
    return this.shortsService.updateVideo(id, dto);
  }

  @Delete('admin/videos/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteVideo(@Param('id') id: string) {
    return this.shortsService.deleteVideo(id);
  }
}
