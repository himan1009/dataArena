import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ShortContentStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  UpsertShortSubtopicDto,
  UpsertShortTopicDto,
  UpsertShortVideoDto,
} from './shorts.dto';
import { extractYouTubeVideoId } from './youtube.util';

@Injectable()
export class ShortsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublicTopics() {
    const topics = await this.prisma.shortTopic.findMany({
      where: { status: ShortContentStatus.ACTIVE },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        subtopics: {
          where: { status: ShortContentStatus.ACTIVE },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
            _count: {
              select: {
                videos: { where: { status: ShortContentStatus.ACTIVE } },
              },
            },
          },
        },
        _count: {
          select: {
            videos: { where: { status: ShortContentStatus.ACTIVE } },
          },
        },
      },
    });

    return {
      topics: topics.map((topic) => ({
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        sortOrder: topic.sortOrder,
        videoCount: topic._count.videos,
        subtopics: topic.subtopics.map((subtopic) => ({
          id: subtopic.id,
          name: subtopic.name,
          slug: subtopic.slug,
          sortOrder: subtopic.sortOrder,
          videoCount: subtopic._count.videos,
        })),
      })),
    };
  }

  async getPublicTopicBySlug(topicSlug: string) {
    const topic = await this.prisma.shortTopic.findFirst({
      where: { slug: topicSlug, status: ShortContentStatus.ACTIVE },
      include: {
        subtopics: {
          where: { status: ShortContentStatus.ACTIVE },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
            _count: {
              select: {
                videos: { where: { status: ShortContentStatus.ACTIVE } },
              },
            },
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return {
      topic: {
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        subtopics: topic.subtopics.map((subtopic) => ({
          id: subtopic.id,
          name: subtopic.name,
          slug: subtopic.slug,
          description: null,
          sortOrder: subtopic.sortOrder,
          videoCount: subtopic._count.videos,
        })),
      },
    };
  }

  async getPublicSubtopicBySlug(topicSlug: string, subtopicSlug: string) {
    const topic = await this.prisma.shortTopic.findFirst({
      where: { slug: topicSlug, status: ShortContentStatus.ACTIVE },
      select: { id: true, name: true, slug: true },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const subtopic = await this.prisma.shortSubtopic.findFirst({
      where: {
        slug: subtopicSlug,
        topicId: topic.id,
        status: ShortContentStatus.ACTIVE,
      },
      include: {
        videos: {
          where: { status: ShortContentStatus.ACTIVE },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!subtopic) {
      throw new NotFoundException('Subtopic not found');
    }

    return {
      subtopic: {
        id: subtopic.id,
        name: subtopic.name,
        slug: subtopic.slug,
        topic,
        videos: subtopic.videos.map((video) => ({
          id: video.id,
          title: video.title,
          description: video.description,
          youtubeUrl: video.youtubeUrl,
          youtubeVideoId: video.youtubeVideoId,
          sortOrder: video.sortOrder,
        })),
      },
    };
  }

  async adminListTopics() {
    const topics = await this.prisma.shortTopic.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        subtopics: {
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
            videos: {
              orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
              select: {
                id: true,
                title: true,
                youtubeUrl: true,
                youtubeVideoId: true,
                status: true,
                sortOrder: true,
              },
            },
          },
        },
        _count: { select: { videos: true, subtopics: true } },
      },
    });

    return { topics };
  }

  async createTopic(dto: UpsertShortTopicDto) {
    try {
      const topic = await this.prisma.shortTopic.create({ data: dto });
      return { topic };
    } catch (error) {
      this.rethrowUnique(error, 'A topic with this slug already exists.');
    }
  }

  async updateTopic(id: string, dto: UpsertShortTopicDto) {
    try {
      const topic = await this.prisma.shortTopic.update({
        where: { id },
        data: dto,
      });
      return { topic };
    } catch (error) {
      this.rethrowUnique(error, 'A topic with this slug already exists.');
    }
  }

  async deleteTopic(id: string) {
    const videoCount = await this.prisma.shortVideo.count({ where: { topicId: id } });
    if (videoCount > 0) {
      throw new BadRequestException(
        'Delete all videos in this topic first, then try again.',
      );
    }

    await this.prisma.shortTopic.delete({ where: { id } });
    return { success: true };
  }

  async createSubtopic(dto: UpsertShortSubtopicDto) {
    const topic = await this.prisma.shortTopic.findUnique({
      where: { id: dto.topicId },
      select: { id: true },
    });
    if (!topic) {
      throw new BadRequestException('Topic not found');
    }

    try {
      const subtopic = await this.prisma.shortSubtopic.create({ data: dto });
      return { subtopic };
    } catch (error) {
      this.rethrowUnique(
        error,
        'A subtopic with this slug already exists in that topic.',
      );
    }
  }

  async updateSubtopic(id: string, dto: UpsertShortSubtopicDto) {
    try {
      const subtopic = await this.prisma.shortSubtopic.update({
        where: { id },
        data: dto,
      });
      return { subtopic };
    } catch (error) {
      this.rethrowUnique(
        error,
        'A subtopic with this slug already exists in that topic.',
      );
    }
  }

  async deleteSubtopic(id: string) {
    const videoCount = await this.prisma.shortVideo.count({
      where: { subtopicId: id },
    });
    if (videoCount > 0) {
      throw new BadRequestException(
        'Delete all videos in this subtopic first, then try again.',
      );
    }

    await this.prisma.shortSubtopic.delete({ where: { id } });
    return { success: true };
  }

  async createVideo(dto: UpsertShortVideoDto) {
    const videoId = extractYouTubeVideoId(dto.youtubeUrl);
    if (!videoId) {
      throw new BadRequestException(
        'Invalid YouTube URL. Paste a Shorts link, watch URL, or youtu.be link.',
      );
    }

    const subtopic = await this.prisma.shortSubtopic.findUnique({
      where: { id: dto.subtopicId },
      select: { id: true, topicId: true },
    });
    if (!subtopic) {
      throw new BadRequestException('Subtopic not found');
    }

    const video = await this.prisma.shortVideo.create({
      data: {
        subtopicId: subtopic.id,
        topicId: subtopic.topicId,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        youtubeUrl: dto.youtubeUrl.trim(),
        youtubeVideoId: videoId,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? ShortContentStatus.ACTIVE,
      },
    });

    return { video };
  }

  async updateVideo(id: string, dto: UpsertShortVideoDto) {
    const videoId = extractYouTubeVideoId(dto.youtubeUrl);
    if (!videoId) {
      throw new BadRequestException('Invalid YouTube URL');
    }

    const subtopic = await this.prisma.shortSubtopic.findUnique({
      where: { id: dto.subtopicId },
      select: { id: true, topicId: true },
    });
    if (!subtopic) {
      throw new BadRequestException('Subtopic not found');
    }

    const video = await this.prisma.shortVideo.update({
      where: { id },
      data: {
        subtopicId: subtopic.id,
        topicId: subtopic.topicId,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        youtubeUrl: dto.youtubeUrl.trim(),
        youtubeVideoId: videoId,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? ShortContentStatus.ACTIVE,
      },
    });

    return { video };
  }

  async deleteVideo(id: string) {
    await this.prisma.shortVideo.delete({ where: { id } });
    return { success: true };
  }

  private rethrowUnique(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(message);
    }
    throw error;
  }
}
