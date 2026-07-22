import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBugReportDto,
  CreateContactMessageDto,
  UpdateFeedbackStatusDto,
} from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  createContactMessage(dto: CreateContactMessageDto, userId?: string) {
    return this.prisma.contactMessage.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        message: dto.message.trim(),
        userId: userId ?? null,
      },
    });
  }

  createBugReport(dto: CreateBugReportDto, userId?: string) {
    return this.prisma.bugReport.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        area: dto.area.trim(),
        pageUrl: dto.pageUrl?.trim() || null,
        message: dto.message.trim(),
        userId: userId ?? null,
      },
    });
  }

  listContactMessages() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  listBugReports() {
    return this.prisma.bugReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateContactStatus(id: string, dto: UpdateFeedbackStatusDto) {
    try {
      return await this.prisma.contactMessage.update({
        where: { id },
        data: { status: dto.status },
      });
    } catch {
      throw new NotFoundException('Contact message not found');
    }
  }

  async updateBugStatus(id: string, dto: UpdateFeedbackStatusDto) {
    try {
      return await this.prisma.bugReport.update({
        where: { id },
        data: { status: dto.status },
      });
    } catch {
      throw new NotFoundException('Bug report not found');
    }
  }

  async markContactRead(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!message) {
      throw new NotFoundException('Contact message not found');
    }

    if (message.status === FeedbackStatus.NEW) {
      return this.prisma.contactMessage.update({
        where: { id },
        data: { status: FeedbackStatus.READ },
      });
    }

    return message;
  }

  async markBugRead(id: string) {
    const report = await this.prisma.bugReport.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException('Bug report not found');
    }

    if (report.status === FeedbackStatus.NEW) {
      return this.prisma.bugReport.update({
        where: { id },
        data: { status: FeedbackStatus.READ },
      });
    }

    return report;
  }
}
