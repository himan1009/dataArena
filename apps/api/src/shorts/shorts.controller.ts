import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
}
