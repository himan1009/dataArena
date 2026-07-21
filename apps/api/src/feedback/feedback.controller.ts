import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  CreateBugReportDto,
  CreateContactMessageDto,
  UpdateFeedbackStatusDto,
} from './dto/feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('contact')
  submitContact(@Body() dto: CreateContactMessageDto) {
    return this.feedbackService
      .createContactMessage(dto)
      .then((message) => ({
        message,
        success: true,
        confirmation: 'Thanks for reaching out. We will get back to you soon.',
      }));
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('bugs')
  submitBug(@Body() dto: CreateBugReportDto) {
    return this.feedbackService
      .createBugReport(dto)
      .then((report) => ({
        report,
        success: true,
        confirmation: 'Bug report received. Thank you for helping us improve.',
      }));
  }

  @Get('admin/contacts')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listContacts() {
    return this.feedbackService.listContactMessages().then((messages) => ({
      messages,
    }));
  }

  @Get('admin/bugs')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listBugs() {
    return this.feedbackService.listBugReports().then((reports) => ({
      reports,
    }));
  }

  @Patch('admin/contacts/:id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateContactStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFeedbackStatusDto,
  ) {
    return this.feedbackService.updateContactStatus(id, dto);
  }

  @Patch('admin/bugs/:id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateBugStatus(@Param('id') id: string, @Body() dto: UpdateFeedbackStatusDto) {
    return this.feedbackService.updateBugStatus(id, dto);
  }

  @Patch('admin/contacts/:id/read')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  markContactRead(@Param('id') id: string) {
    return this.feedbackService.markContactRead(id);
  }

  @Patch('admin/bugs/:id/read')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  markBugRead(@Param('id') id: string) {
    return this.feedbackService.markBugRead(id);
  }
}
