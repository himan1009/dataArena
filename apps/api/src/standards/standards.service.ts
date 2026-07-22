import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WritingStandardKey } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  WRITING_STANDARD_DEFAULTS,
  WRITING_STANDARDS_CONTENT_VERSION,
} from './standards.defaults';

@Injectable()
export class StandardsService {
  private readonly logger = new Logger(StandardsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async ensureDefaults() {
    const versionTag = `<!-- standards-v${WRITING_STANDARDS_CONTENT_VERSION} -->`;

    try {
      for (const standard of WRITING_STANDARD_DEFAULTS) {
        const versionedContent = standard.content.includes(versionTag)
          ? standard.content
          : `${standard.content}\n\n${versionTag}`;

        const existing = await this.prisma.writingStandard.findUnique({
          where: { key: standard.key },
        });

        if (!existing) {
          await this.prisma.writingStandard.create({
            data: {
              key: standard.key,
              title: standard.title,
              content: versionedContent,
            },
          });
        }
      }
    } catch (error) {
      this.logger.warn(
        'Writing standards table is unavailable. Run prisma migrate deploy if you need this feature.',
      );
      this.logger.debug(
        error instanceof Error ? error.message : 'Unknown standards init error',
      );
    }
  }

  private serializeStandard(standard: {
    id: string;
    key: WritingStandardKey;
    title: string;
    content: string;
    updatedAt: Date;
    updatedBy: { name: string | null; email: string } | null;
  }) {
    return {
      id: standard.id,
      key: standard.key,
      title: standard.title,
      content: standard.content,
      updatedAt: standard.updatedAt.toISOString(),
      updatedByName:
        standard.updatedBy?.name ?? standard.updatedBy?.email ?? null,
    };
  }

  async listStandards() {
    await this.ensureDefaults();

    const standards = await this.prisma.writingStandard.findMany({
      include: {
        updatedBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { key: 'asc' },
    });

    return {
      standards: standards.map((standard) => this.serializeStandard(standard)),
    };
  }

  async getStandard(key: WritingStandardKey) {
    await this.ensureDefaults();

    const standard = await this.prisma.writingStandard.findUnique({
      where: { key },
      include: {
        updatedBy: {
          select: { name: true, email: true },
        },
      },
    });

    if (!standard) {
      throw new NotFoundException('Writing standard not found');
    }

    return {
      standard: this.serializeStandard(standard),
    };
  }

  async updateStandard(
    key: WritingStandardKey,
    adminId: string,
    dto: { title?: string; content?: string },
  ) {
    await this.ensureDefaults();

    const existing = await this.prisma.writingStandard.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException('Writing standard not found');
    }

    const standard = await this.prisma.writingStandard.update({
      where: { key },
      data: {
        title: dto.title ?? existing.title,
        content: dto.content ?? existing.content,
        updatedById: adminId,
      },
      include: {
        updatedBy: {
          select: { name: true, email: true },
        },
      },
    });

    return {
      standard: this.serializeStandard(standard),
    };
  }
}
