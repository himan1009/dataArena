import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PracticeContentStatus,
  PracticeQuestionStatus,
  Prisma,
  Role,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePracticeQuestionDto,
  ReviewPracticeQuestionDto,
  UpdatePracticeQuestionDto,
  UpsertPracticeCategoryDto,
  UpsertPracticeSubtopicDto,
  UpsertPracticeTopicDto,
} from './dto/practice.dto';

const authorSelect = {
  id: true,
  name: true,
  email: true,
} as const;

const taxonomyInclude = {
  category: { select: { id: true, name: true, slug: true } },
  topic: { select: { id: true, name: true, slug: true } },
  subtopic: { select: { id: true, name: true, slug: true } },
} as const;

function parseCompanyTags(input?: string) {
  if (!input?.trim()) return [];
  return [
    ...new Set(
      input
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
}

@Injectable()
export class PracticeService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeCompanyTags(tags?: string[]) {
    if (!tags?.length) return [];
    return [
      ...new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
    ].slice(0, 12);
  }

  private async assertCanUpload(userId: string, role: string) {
    if (role === Role.ADMIN) return;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { canUploadQuestions: true, isActive: true },
    });
    if (!user?.isActive || !user.canUploadQuestions) {
      throw new ForbiddenException('Question upload permission is required');
    }
  }

  private mapPublicQuestion(
    question: Prisma.PracticeQuestionGetPayload<{
      include: typeof taxonomyInclude;
    }>,
  ) {
    return {
      id: question.id,
      title: question.title,
      platform: question.platform,
      questionUrl: question.questionUrl,
      difficulty: question.difficulty,
      companyTags: question.companyTags,
      estimatedTime: question.estimatedTime,
      description: question.description,
      publishedAt: question.publishedAt,
      sortOrder: question.sortOrder,
      addedBy: question.authorNameSnapshot,
      category: question.category,
      topic: question.topic,
      subtopic: question.subtopic,
    };
  }

  private mapEditorQuestion(
    question: Prisma.PracticeQuestionGetPayload<{
      include: typeof taxonomyInclude;
    }>,
  ) {
    return {
      ...this.mapPublicQuestion(question),
      status: question.status,
      reviewComment: question.reviewComment,
      submittedAt: question.submittedAt,
      reviewedAt: question.reviewedAt,
      approvedByNameSnapshot: question.approvedByNameSnapshot,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private async resolveTaxonomyRefs(topicId: string, categoryId?: string) {
    const topic = await this.prisma.practiceTopic.findUnique({
      where: { id: topicId },
      select: { id: true, categoryId: true },
    });

    if (!topic) {
      throw new BadRequestException('Topic not found');
    }

    if (categoryId && topic.categoryId !== categoryId) {
      throw new BadRequestException('Topic does not belong to the selected category');
    }

    return {
      categoryId: topic.categoryId,
      topicId: topic.id,
    };
  }

  private async validateTaxonomy(
    categoryId: string,
    topicId: string,
    subtopicId?: string | null,
  ) {
    const topic = await this.prisma.practiceTopic.findFirst({
      where: { id: topicId, categoryId },
      include: { category: true },
    });
    if (!topic) {
      throw new BadRequestException('Topic does not belong to the selected category');
    }

    if (subtopicId) {
      const subtopic = await this.prisma.practiceSubtopic.findFirst({
        where: { id: subtopicId, topicId },
      });
      if (!subtopic) {
        throw new BadRequestException('Subtopic does not belong to the selected topic');
      }
    }

    return topic;
  }

  async listPublicCategories() {
    const categories = await this.prisma.practiceCategory.findMany({
      where: { status: PracticeContentStatus.ACTIVE },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        topics: {
          where: { status: PracticeContentStatus.ACTIVE },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
            subtopics: {
              where: { status: PracticeContentStatus.ACTIVE },
              orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            },
            _count: {
              select: {
                questions: { where: { status: PracticeQuestionStatus.PUBLISHED } },
              },
            },
          },
        },
        _count: {
          select: {
            questions: { where: { status: PracticeQuestionStatus.PUBLISHED } },
          },
        },
      },
    });

    return { categories };
  }

  async getPublicCategoryBySlug(slug: string) {
    const category = await this.prisma.practiceCategory.findFirst({
      where: { slug, status: PracticeContentStatus.ACTIVE },
      include: {
        topics: {
          where: { status: PracticeContentStatus.ACTIVE },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
            _count: {
              select: {
                questions: { where: { status: PracticeQuestionStatus.PUBLISHED } },
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        sortOrder: category.sortOrder,
        topics: category.topics.map((topic) => ({
          id: topic.id,
          name: topic.name,
          slug: topic.slug,
          description: topic.description,
          sortOrder: topic.sortOrder,
          questionCount: topic._count.questions,
        })),
      },
    };
  }

  async getPublicTopicBySlug(categorySlug: string, topicSlug: string) {
    const category = await this.prisma.practiceCategory.findFirst({
      where: { slug: categorySlug, status: PracticeContentStatus.ACTIVE },
      select: { id: true, name: true, slug: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const topic = await this.prisma.practiceTopic.findFirst({
      where: {
        slug: topicSlug,
        categoryId: category.id,
        status: PracticeContentStatus.ACTIVE,
      },
      include: {
        questions: {
          where: { status: PracticeQuestionStatus.PUBLISHED },
          orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'asc' }, { createdAt: 'asc' }],
          include: taxonomyInclude,
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
        sortOrder: topic.sortOrder,
        category,
        questions: topic.questions.map((question) => this.mapPublicQuestion(question)),
      },
    };
  }

  async listPublishedQuestions(filters: {
    categoryId?: string;
    topicId?: string;
    subtopicId?: string;
    difficulty?: string;
  }) {
    const where: Prisma.PracticeQuestionWhereInput = {
      status: PracticeQuestionStatus.PUBLISHED,
    };
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.topicId) where.topicId = filters.topicId;
    if (filters.subtopicId) where.subtopicId = filters.subtopicId;
    if (filters.difficulty) {
      where.difficulty =
        filters.difficulty as Prisma.EnumPracticeDifficultyFilter['equals'];
    }

    const questions = await this.prisma.practiceQuestion.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'asc' }, { createdAt: 'asc' }],
      include: taxonomyInclude,
    });

    return {
      questions: questions.map((q) => this.mapPublicQuestion(q)),
    };
  }

  async listMine(authorId: string) {
    const questions = await this.prisma.practiceQuestion.findMany({
      where: { authorId },
      orderBy: { updatedAt: 'desc' },
      include: taxonomyInclude,
    });
    return { questions: questions.map((q) => this.mapEditorQuestion(q)) };
  }

  async createQuestion(
    authorId: string,
    role: string,
    dto: CreatePracticeQuestionDto,
    submit = false,
  ) {
    await this.assertCanUpload(authorId, role);
    const taxonomy = await this.resolveTaxonomyRefs(dto.topicId, dto.categoryId);

    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: { name: true, email: true },
    });

    const question = await this.prisma.practiceQuestion.create({
      data: {
        title: dto.title.trim(),
        platform: dto.platform,
        questionUrl: dto.questionUrl.trim(),
        difficulty: dto.difficulty,
        categoryId: taxonomy.categoryId,
        topicId: taxonomy.topicId,
        subtopicId: null,
        companyTags: this.normalizeCompanyTags(dto.companyTags),
        estimatedTime: dto.estimatedTime?.trim() || null,
        description: dto.description?.trim() || null,
        authorId,
        authorNameSnapshot: author?.name || author?.email || 'Contributor',
        status: submit ? PracticeQuestionStatus.SUBMITTED : PracticeQuestionStatus.DRAFT,
        submittedAt: submit ? new Date() : null,
      },
      include: taxonomyInclude,
    });

    return { question: this.mapEditorQuestion(question) };
  }

  async updateQuestion(
    id: string,
    authorId: string,
    role: string,
    dto: UpdatePracticeQuestionDto,
    asAdmin = false,
  ) {
    const existing = await this.prisma.practiceQuestion.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Question not found');

    if (!asAdmin) {
      await this.assertCanUpload(authorId, role);
      if (existing.authorId !== authorId) {
        throw new ForbiddenException('You can only edit your own questions');
      }
      if (
        existing.status !== PracticeQuestionStatus.DRAFT &&
        existing.status !== PracticeQuestionStatus.REJECTED
      ) {
        throw new ForbiddenException('You can only edit drafts or rejected questions');
      }
    }

    const categoryId = dto.categoryId ?? existing.categoryId;
    const topicId = dto.topicId ?? existing.topicId;
    const taxonomy = await this.resolveTaxonomyRefs(topicId, categoryId);

    const question = await this.prisma.practiceQuestion.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        platform: dto.platform,
        questionUrl: dto.questionUrl?.trim(),
        difficulty: dto.difficulty,
        categoryId: taxonomy.categoryId,
        topicId: taxonomy.topicId,
        subtopicId: null,
        companyTags:
          dto.companyTags !== undefined
            ? this.normalizeCompanyTags(dto.companyTags)
            : undefined,
        estimatedTime:
          dto.estimatedTime !== undefined
            ? dto.estimatedTime.trim() || null
            : undefined,
        description:
          dto.description !== undefined
            ? dto.description.trim() || null
            : undefined,
        ...(asAdmin
          ? {}
          : {
              status: PracticeQuestionStatus.DRAFT,
              reviewComment: null,
              submittedAt: null,
              reviewedAt: null,
            }),
      },
      include: taxonomyInclude,
    });

    return { question: this.mapEditorQuestion(question) };
  }

  async submitQuestion(id: string, authorId: string, role: string) {
    await this.assertCanUpload(authorId, role);
    const existing = await this.prisma.practiceQuestion.findUnique({ where: { id } });
    if (!existing || existing.authorId !== authorId) {
      throw new NotFoundException('Question not found');
    }
    if (
      existing.status !== PracticeQuestionStatus.DRAFT &&
      existing.status !== PracticeQuestionStatus.REJECTED
    ) {
      throw new BadRequestException('Only drafts or rejected questions can be submitted');
    }

    const question = await this.prisma.practiceQuestion.update({
      where: { id },
      data: {
        status: PracticeQuestionStatus.SUBMITTED,
        submittedAt: new Date(),
        reviewComment: null,
      },
      include: taxonomyInclude,
    });

    return { question: this.mapEditorQuestion(question) };
  }

  async deleteQuestion(id: string, authorId: string, role: string, asAdmin = false) {
    const existing = await this.prisma.practiceQuestion.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Question not found');

    if (!asAdmin) {
      await this.assertCanUpload(authorId, role);
      if (existing.authorId !== authorId) {
        throw new ForbiddenException('You can only delete your own questions');
      }
      if (existing.status !== PracticeQuestionStatus.DRAFT) {
        throw new ForbiddenException('Only drafts can be deleted');
      }
    }

    await this.prisma.practiceQuestion.delete({ where: { id } });
    return { success: true };
  }

  async adminStats() {
    const [categories, topics, pendingReview, published] = await Promise.all([
      this.prisma.practiceCategory.count(),
      this.prisma.practiceTopic.count(),
      this.prisma.practiceQuestion.count({
        where: { status: PracticeQuestionStatus.SUBMITTED },
      }),
      this.prisma.practiceQuestion.count({
        where: { status: PracticeQuestionStatus.PUBLISHED },
      }),
    ]);
    return { categories, topics, pendingReview, published };
  }

  async adminReviewQueue() {
    const questions = await this.prisma.practiceQuestion.findMany({
      where: { status: PracticeQuestionStatus.SUBMITTED },
      orderBy: { submittedAt: 'asc' },
      include: taxonomyInclude,
    });
    return {
      questions: questions.map((q) => ({
        ...this.mapEditorQuestion(q),
        authorNameSnapshot: q.authorNameSnapshot,
      })),
    };
  }

  async adminReview(id: string, adminId: string, dto: ReviewPracticeQuestionDto) {
    const existing = await this.prisma.practiceQuestion.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Question not found');
    if (existing.status !== PracticeQuestionStatus.SUBMITTED) {
      throw new BadRequestException('Question is not pending review');
    }

    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { name: true, email: true },
    });

    const now = new Date();
    const nextSortOrder =
      dto.action === 'approve'
        ? await this.prisma.practiceQuestion
            .aggregate({
              where: {
                topicId: existing.topicId,
                status: PracticeQuestionStatus.PUBLISHED,
              },
              _max: { sortOrder: true },
            })
            .then((result) => (result._max.sortOrder ?? 0) + 1)
        : undefined;

    const question = await this.prisma.practiceQuestion.update({
      where: { id },
      data:
        dto.action === 'approve'
          ? {
              status: PracticeQuestionStatus.PUBLISHED,
              reviewedAt: now,
              publishedAt: now,
              sortOrder: nextSortOrder,
              approvedById: adminId,
              approvedByNameSnapshot: admin?.name || admin?.email || 'Admin',
              reviewComment: dto.comment || null,
            }
          : {
              status: PracticeQuestionStatus.REJECTED,
              reviewedAt: now,
              reviewComment: dto.comment || 'Rejected by admin',
            },
      include: taxonomyInclude,
    });

    return { question: this.mapEditorQuestion(question) };
  }

  async adminListCategories() {
    const categories = await this.prisma.practiceCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        topics: {
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
            questions: {
              orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
              select: {
                id: true,
                title: true,
                status: true,
                difficulty: true,
                sortOrder: true,
              },
            },
            _count: {
              select: { questions: true },
            },
          },
        },
        _count: {
          select: { questions: true, topics: true },
        },
      },
    });
    return { categories };
  }

  async createCategory(dto: UpsertPracticeCategoryDto) {
    const category = await this.prisma.practiceCategory.create({ data: dto });
    return { category };
  }

  async updateCategory(id: string, dto: UpsertPracticeCategoryDto) {
    const category = await this.prisma.practiceCategory.update({
      where: { id },
      data: dto,
    });
    return { category };
  }

  async deleteCategory(id: string) {
    const questionCount = await this.prisma.practiceQuestion.count({
      where: { categoryId: id },
    });
    if (questionCount > 0) {
      throw new BadRequestException(
        'Delete all questions in this category first, then try again.',
      );
    }

    await this.prisma.practiceCategory.delete({ where: { id } });
    return { success: true };
  }

  async createTopic(dto: UpsertPracticeTopicDto) {
    if (!dto.categoryId?.trim()) {
      throw new BadRequestException('Category is required');
    }

    const category = await this.prisma.practiceCategory.findUnique({
      where: { id: dto.categoryId },
      select: { id: true },
    });

    if (!category) {
      throw new BadRequestException('Selected category was not found');
    }

    const topic = await this.prisma.practiceTopic.create({ data: dto });
    return { topic };
  }

  async updateTopic(id: string, dto: UpsertPracticeTopicDto) {
    const topic = await this.prisma.practiceTopic.update({ where: { id }, data: dto });
    return { topic };
  }

  async deleteTopic(id: string) {
    const questionCount = await this.prisma.practiceQuestion.count({
      where: { topicId: id },
    });
    if (questionCount > 0) {
      throw new BadRequestException(
        'Delete all questions in this topic first, then try again.',
      );
    }

    await this.prisma.practiceTopic.delete({ where: { id } });
    return { success: true };
  }

  async createSubtopic(dto: UpsertPracticeSubtopicDto) {
    const subtopic = await this.prisma.practiceSubtopic.create({ data: dto });
    return { subtopic };
  }

  async updateSubtopic(id: string, dto: UpsertPracticeSubtopicDto) {
    const subtopic = await this.prisma.practiceSubtopic.update({
      where: { id },
      data: dto,
    });
    return { subtopic };
  }

  async deleteSubtopic(id: string) {
    const count = await this.prisma.practiceQuestion.count({ where: { subtopicId: id } });
    if (count > 0) {
      throw new BadRequestException('Cannot delete a subtopic that has questions');
    }
    await this.prisma.practiceSubtopic.delete({ where: { id } });
    return { success: true };
  }

  async listTaxonomyForEditors() {
    return this.listPublicCategories();
  }
}
