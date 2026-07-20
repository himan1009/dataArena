import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleStatus, Prisma, TopicStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAuthorArticleDto,
  ReviewAction,
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

const authorSelect = {
  id: true,
  name: true,
  email: true,
  linkedinUrl: true,
} as const;

function mapPublishedAuthor(article: {
  authorNameSnapshot: string | null;
  authorLinkedinSnapshot: string | null;
  author: {
    id: string;
    name: string | null;
    email: string;
    linkedinUrl: string | null;
  } | null;
}) {
  if (article.authorNameSnapshot) {
    return {
      id: article.author?.id ?? 'legacy',
      name: article.authorNameSnapshot,
      email: article.author?.email ?? '',
      linkedinUrl: article.authorLinkedinSnapshot,
    };
  }

  return article.author;
}

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getAuthorSnapshots(authorId: string | null) {
    if (!authorId) {
      return {
        authorNameSnapshot: 'DataArena Team',
        authorLinkedinSnapshot: null,
      };
    }

    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: { name: true, email: true, linkedinUrl: true },
    });

    return {
      authorNameSnapshot:
        author?.name?.trim() || author?.email.split('@')[0] || 'Contributor',
      authorLinkedinSnapshot: author?.linkedinUrl ?? null,
    };
  }

  async listCategories() {
    const categories = await this.prisma.category.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            topics: {
              where: { published: true },
            },
          },
        },
      },
    });

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        topicCount: category._count.topics,
      })),
    };
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, published: true },
      include: {
        topics: {
          where: { published: true },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
            _count: {
              select: {
                articles: {
                  where: { status: ArticleStatus.PUBLISHED },
                },
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
        topics: category.topics.map((topic) => ({
          id: topic.id,
          name: topic.name,
          slug: topic.slug,
          description: topic.description,
          articleCount: topic._count.articles,
        })),
      },
    };
  }

  async getTopicBySlug(categorySlug: string, topicSlug: string) {
    const topic = await this.prisma.topic.findFirst({
      where: {
        slug: topicSlug,
        published: true,
        category: {
          slug: categorySlug,
          published: true,
        },
      },
      include: {
        category: true,
        articles: {
          where: { status: ArticleStatus.PUBLISHED },
          orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
          select: {
            id: true,
            title: true,
            slug: true,
            sortOrder: true,
            updatedAt: true,
            publishedAt: true,
            author: { select: authorSelect },
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
        category: {
          id: topic.category.id,
          name: topic.category.name,
          slug: topic.category.slug,
        },
        articles: topic.articles,
      },
    };
  }

  async getArticleBySlug(
    categorySlug: string,
    topicSlug: string,
    articleSlug: string,
  ) {
    const article = await this.prisma.article.findFirst({
      where: {
        slug: articleSlug,
        status: ArticleStatus.PUBLISHED,
        topic: {
          slug: topicSlug,
          published: true,
          category: {
            slug: categorySlug,
            published: true,
          },
        },
      },
      include: {
        author: { select: authorSelect },
        topic: {
          include: {
            category: true,
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
              orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return {
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        updatedAt: article.updatedAt,
        publishedAt: article.publishedAt,
        author: mapPublishedAuthor(article),
        topic: {
          id: article.topic.id,
          name: article.topic.name,
          slug: article.topic.slug,
          category: {
            id: article.topic.category.id,
            name: article.topic.category.name,
            slug: article.topic.category.slug,
          },
          articles: article.topic.articles,
        },
      },
    };
  }

  async listAvailableTopics(authorId: string) {
    const topics = await this.prisma.topic.findMany({
      where: {
        openForAuthors: true,
        published: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        claimedBy: {
          select: { id: true, name: true },
        },
        articles: {
          select: { id: true, authorId: true, status: true },
        },
      },
    });

    const available = topics.filter((topic) => {
      const hasPublished = topic.articles.some(
        (article) => article.status === ArticleStatus.PUBLISHED,
      );
      if (hasPublished) {
        return false;
      }

      const activeByOther = topic.articles.some(
        (article) =>
          article.authorId !== authorId &&
          (article.status === ArticleStatus.DRAFT ||
            article.status === ArticleStatus.SUBMITTED ||
            article.status === ArticleStatus.CHANGES_REQUESTED),
      );
      if (activeByOther) {
        return false;
      }

      const myActive = topic.articles.some(
        (article) =>
          article.authorId === authorId &&
          (article.status === ArticleStatus.DRAFT ||
            article.status === ArticleStatus.SUBMITTED ||
            article.status === ArticleStatus.CHANGES_REQUESTED),
      );
      if (myActive) {
        return false;
      }

      if (topic.claimedById && topic.claimedById !== authorId) {
        return false;
      }

      return true;
    });

    return {
      topics: available.map((topic) => ({
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        status: topic.status,
        category: topic.category,
        claimedBy: topic.claimedBy,
      })),
    };
  }

  async listMyArticles(authorId: string) {
    const articles = await this.prisma.article.findMany({
      where: { authorId },
      orderBy: { updatedAt: 'desc' },
      include: {
        topic: {
          include: {
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    return {
      articles: articles.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        reviewComment: article.reviewComment,
        updatedAt: article.updatedAt,
        submittedAt: article.submittedAt,
        publishedAt: article.publishedAt,
        topic: {
          id: article.topic.id,
          name: article.topic.name,
          slug: article.topic.slug,
          category: article.topic.category,
        },
      })),
    };
  }

  async getAuthorArticle(articleId: string, authorId: string) {
    const article = await this.prisma.article.findFirst({
      where: { id: articleId, authorId },
      include: {
        topic: {
          include: {
            category: { select: { name: true, slug: true } },
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return { article };
  }

  async createAuthorArticle(authorId: string, dto: CreateAuthorArticleDto) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: dto.topicId },
      include: {
        articles: {
          where: {
            status: {
              in: [
                ArticleStatus.DRAFT,
                ArticleStatus.SUBMITTED,
                ArticleStatus.CHANGES_REQUESTED,
                ArticleStatus.PUBLISHED,
              ],
            },
          },
        },
      },
    });

    if (!topic || !topic.openForAuthors) {
      throw new NotFoundException('Topic not available for writing');
    }

    if (topic.claimedById && topic.claimedById !== authorId) {
      throw new ForbiddenException('This topic is already claimed by another author');
    }

    const blockingArticle = topic.articles.find(
      (article) =>
        article.authorId !== authorId &&
        article.status !== ArticleStatus.REJECTED,
    );

    if (blockingArticle) {
      throw new ConflictException('This topic already has an active article');
    }

    const article = await this.prisma.$transaction(async (tx) => {
      await tx.topic.update({
        where: { id: topic.id },
        data: {
          claimedById: authorId,
          status: TopicStatus.IN_PROGRESS,
        },
      });

      return tx.article.create({
        data: {
          topicId: dto.topicId,
          authorId,
          title: dto.title,
          slug: dto.slug,
          content: dto.content,
          status: ArticleStatus.DRAFT,
          published: false,
        },
      });
    });

    return { article, message: 'Draft created' };
  }

  async updateAuthorArticle(
    articleId: string,
    authorId: string,
    dto: UpdateAuthorArticleDto,
  ) {
    const article = await this.prisma.article.findFirst({
      where: { id: articleId, authorId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (
      article.status !== ArticleStatus.DRAFT &&
      article.status !== ArticleStatus.CHANGES_REQUESTED
    ) {
      throw new ForbiddenException('You can only edit draft or change-requested articles');
    }

    const updated = await this.prisma.article.update({
      where: { id: articleId },
      data: dto,
    });

    return { article: updated, message: 'Draft saved' };
  }

  async submitAuthorArticle(articleId: string, authorId: string) {
    const article = await this.prisma.article.findFirst({
      where: { id: articleId, authorId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (
      article.status !== ArticleStatus.DRAFT &&
      article.status !== ArticleStatus.CHANGES_REQUESTED
    ) {
      throw new ForbiddenException('Only drafts or revision requests can be submitted');
    }

    const updated = await this.prisma.article.update({
      where: { id: articleId },
      data: {
        status: ArticleStatus.SUBMITTED,
        submittedAt: new Date(),
        reviewComment: null,
      },
    });

    return { article: updated, message: 'Article submitted for review' };
  }

  async getReviewQueue() {
    const articles = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.SUBMITTED,
      },
      orderBy: { submittedAt: 'asc' },
      include: {
        author: { select: authorSelect },
        topic: {
          include: {
            category: { select: { name: true, slug: true } },
          },
        },
      },
    });

    return { articles };
  }

  async reviewArticle(articleId: string, dto: ReviewArticleDto) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      include: { topic: true, author: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.status !== ArticleStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted articles can be reviewed');
    }

    const now = new Date();

    if (dto.action === ReviewAction.APPROVE) {
      const snapshots = await this.getAuthorSnapshots(article.authorId);

      const updated = await this.prisma.$transaction(async (tx) => {
        const result = await tx.article.update({
          where: { id: articleId },
          data: {
            status: ArticleStatus.PUBLISHED,
            published: true,
            publishedAt: now,
            reviewedAt: now,
            reviewComment: dto.comment ?? null,
            authorNameSnapshot: snapshots.authorNameSnapshot,
            authorLinkedinSnapshot: snapshots.authorLinkedinSnapshot,
          },
        });

        await tx.topic.update({
          where: { id: article.topicId },
          data: { status: TopicStatus.COMPLETED },
        });

        return result;
      });

      return { article: updated, message: 'Article published' };
    }

    if (dto.action === ReviewAction.REQUEST_CHANGES) {
      if (!dto.comment?.trim()) {
        throw new BadRequestException('Comment is required when requesting changes');
      }

      const updated = await this.prisma.article.update({
        where: { id: articleId },
        data: {
          status: ArticleStatus.CHANGES_REQUESTED,
          reviewedAt: now,
          reviewComment: dto.comment.trim(),
        },
      });

      return { article: updated, message: 'Changes requested' };
    }

    if (dto.action === ReviewAction.REJECT) {
      const updated = await this.prisma.$transaction(async (tx) => {
        const result = await tx.article.update({
          where: { id: articleId },
          data: {
            status: ArticleStatus.REJECTED,
            published: false,
            reviewedAt: now,
            reviewComment: dto.comment?.trim() ?? 'Rejected by admin',
          },
        });

        await tx.topic.update({
          where: { id: article.topicId },
          data: {
            status: TopicStatus.OPEN,
            claimedById: null,
          },
        });

        return result;
      });

      return { article: updated, message: 'Article rejected' };
    }

    throw new BadRequestException('Invalid review action');
  }

  async adminListCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { topics: true },
        },
      },
    });

    return { categories };
  }

  createCategory(dto: CreateCategoryDto) {
    return this.prisma.category
      .create({ data: dto })
      .catch(this.handleUniqueError('Category slug already exists'));
  }

  updateCategory(id: string, dto: UpdateCategoryDto) {
    return this.prisma.category
      .update({ where: { id }, data: dto })
      .catch(this.handleNotFound('Category not found'));
  }

  deleteCategory(id: string) {
    return this.prisma.category
      .delete({ where: { id } })
      .catch(this.handleNotFound('Category not found'));
  }

  createTopic(dto: CreateTopicDto) {
    return this.prisma.topic
      .create({
        data: {
          ...dto,
          openForAuthors: dto.openForAuthors ?? false,
        },
      })
      .catch(this.handleUniqueError('Topic slug already exists in category'));
  }

  updateTopic(id: string, dto: UpdateTopicDto) {
    return this.prisma.topic
      .update({ where: { id }, data: dto })
      .catch(this.handleNotFound('Topic not found'));
  }

  deleteTopic(id: string) {
    return this.prisma.topic
      .delete({ where: { id } })
      .catch(this.handleNotFound('Topic not found'));
  }

  async createArticle(dto: CreateArticleDto) {
    const published = dto.published ?? false;
    const snapshots = published
      ? await this.getAuthorSnapshots(null)
      : { authorNameSnapshot: null, authorLinkedinSnapshot: null };

    return this.prisma.article
      .create({
        data: {
          ...dto,
          status: published ? ArticleStatus.PUBLISHED : ArticleStatus.DRAFT,
          published,
          publishedAt: published ? new Date() : null,
          authorNameSnapshot: snapshots.authorNameSnapshot,
          authorLinkedinSnapshot: snapshots.authorLinkedinSnapshot,
        },
      })
      .catch(this.handleUniqueError('Article slug already exists in topic'));
  }

  async updateArticle(id: string, dto: UpdateArticleDto) {
    const data: Prisma.ArticleUpdateInput = { ...dto };

    if (dto.published !== undefined) {
      data.status = dto.published
        ? ArticleStatus.PUBLISHED
        : ArticleStatus.DRAFT;
      data.publishedAt = dto.published ? new Date() : null;

      if (dto.published) {
        const existing = await this.prisma.article.findUnique({
          where: { id },
          select: { authorId: true, authorNameSnapshot: true },
        });

        if (existing && !existing.authorNameSnapshot) {
          const snapshots = await this.getAuthorSnapshots(existing.authorId);
          data.authorNameSnapshot = snapshots.authorNameSnapshot;
          data.authorLinkedinSnapshot = snapshots.authorLinkedinSnapshot;
        }
      }
    }

    return this.prisma.article
      .update({ where: { id }, data })
      .catch(this.handleNotFound('Article not found'));
  }

  deleteArticle(id: string) {
    return this.prisma.article
      .delete({ where: { id } })
      .catch(this.handleNotFound('Article not found'));
  }

  private handleUniqueError(message: string) {
    return (error: unknown) => {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(message);
      }
      throw error;
    };
  }

  private handleNotFound(message: string) {
    return (error: unknown) => {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(message);
      }
      throw error;
    };
  }
}
