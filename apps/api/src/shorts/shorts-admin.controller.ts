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

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  UpsertShortSubtopicDto,
  UpsertShortTopicDto,
  UpsertShortVideoDto,
} from './shorts.dto';
import { ShortsService } from './shorts.service';

/** Admin routes under `/shorts/admin/*` (registered before public `topics/:slug` routes). */
@Controller('shorts/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class ShortsAdminController {
  constructor(private readonly shortsService: ShortsService) {}

  @Get('topics')
  adminListTopics() {
    return this.shortsService.adminListTopics();
  }

  @Post('topics')
  createTopic(@Body() dto: UpsertShortTopicDto) {
    return this.shortsService.createTopic(dto);
  }

  @Patch('topics/:id')
  updateTopic(@Param('id') id: string, @Body() dto: UpsertShortTopicDto) {
    return this.shortsService.updateTopic(id, dto);
  }

  @Delete('topics/:id')
  deleteTopic(@Param('id') id: string) {
    return this.shortsService.deleteTopic(id);
  }

  @Post('subtopics')
  createSubtopic(@Body() dto: UpsertShortSubtopicDto) {
    return this.shortsService.createSubtopic(dto);
  }

  @Patch('subtopics/:id')
  updateSubtopic(@Param('id') id: string, @Body() dto: UpsertShortSubtopicDto) {
    return this.shortsService.updateSubtopic(id, dto);
  }

  @Delete('subtopics/:id')
  deleteSubtopic(@Param('id') id: string) {
    return this.shortsService.deleteSubtopic(id);
  }

  @Post('videos')
  createVideo(@Body() dto: UpsertShortVideoDto) {
    return this.shortsService.createVideo(dto);
  }

  @Patch('videos/:id')
  updateVideo(@Param('id') id: string, @Body() dto: UpsertShortVideoDto) {
    return this.shortsService.updateVideo(id, dto);
  }

  @Delete('videos/:id')
  deleteVideo(@Param('id') id: string) {
    return this.shortsService.deleteVideo(id);
  }
}
