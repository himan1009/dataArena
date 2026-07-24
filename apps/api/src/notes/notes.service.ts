import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleStatus, Prisma, Role, TopicStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAuthorArticleDto,
  EditRequestReviewAction,
  RequestEditAccessDto,
  ReviewAction,
  ReviewArticleDto,
  ReviewEditRequestDto,
  AssignEditorDto,
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

const publicAuthorSelect = {
  id: true,
  name: true,
  linkedinUrl: true,
} as const;

function mapPublishedAuthor(article: {
  authorNameSnapshot: string | null;
  authorLinkedinSnapshot: string | null;
  author: {
    id: string;
    name: string | null;
    linkedinUrl: string | null;
  } | null;
}) {
  if (article.authorNameSnapshot) {
    return {
      id: article.author?.id ?? 'legacy',
      name: article.authorNameSnapshot,
      linkedinUrl: article.authorLinkedinSnapshot,
    };
  }

  return article.author;
}

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  private async findArticleForAuthorAccess(articleId: string, userId: string) {
    return this.prisma.article.findFirst({
      where: {
        id: articleId,
        OR: [
          { authorId: userId },
          { editAssigneeId: userId },
          {
            lastEditedById: userId,
            authorId: { not: userId },
          },
        ],
      },
      include: {
        topic: {
          include: {
            category: { select: { name: true, slug: true } },
          },
        },
        author: { select: authorSelect },
        editAssignee: { select: authorSelect },
        editRequestedBy: { select: authorSelect },
      },
    });
  }

  private canUserEditArticle(
    article: {
      authorId: string | null;
      editAssigneeId: string | null;
      status: ArticleStatus;
    },
    userId: string,
  ) {
    if (article.editAssigneeId === userId) {
      return (
        article.status === ArticleStatus.CHANGES_REQUESTED ||
        article.status === ArticleStatus.PUBLISHED ||
        article.status === ArticleStatus.SUBMITTED
      );
    }

    if (article.authorId === userId) {
      return (
        article.status === ArticleStatus.DRAFT ||
        article.status === ArticleStatus.CHANGES_REQUESTED
      );
    }

    return false;
  }

  private applyEditorAudit(
    data: Prisma.ArticleUpdateInput,
    editor?: { id: string; role: Role },
  ) {
    if (!editor) {
      return data;
    }

    data.lastEditedBy = { connect: { id: editor.id } };
    data.lastEditedByRole = editor.role;

    if (editor.role === Role.ADMIN) {
      data.adminEditedAt = new Date();
    }

    if (editor.role === Role.EDITOR) {
      data.editorEditedAt = new Date();
    }

    return data;
  }

  private async getEditorSnapshot(editorId: string) {
    const editor = await this.prisma.user.findUnique({
      where: { id: editorId },
      select: { name: true, email: true },
    });

    return editor?.name?.trim() || editor?.email.split('@')[0] || 'Editor';
  }

  async listAuthorEditors() {
    const editors = await this.prisma.user.findMany({
      where: {
        isActive: true,
        role: { in: [Role.EDITOR, Role.ADMIN] },
      },
      orderBy: [{ name: 'asc' }, { email: 'asc' }],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return { editors };
  }

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
            author: { select: publicAuthorSelect },
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
        author: { select: publicAuthorSelect },
        lastEditedBy: { select: publicAuthorSelect },
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
        adminEditedAt: article.adminEditedAt,
        editorEditedAt: article.editorEditedAt,
        lastEditedByRole: article.lastEditedByRole,
        lastEditorNameSnapshot: article.lastEditorNameSnapshot,
        lastEditor: article.lastEditedBy
          ? {
              id: article.lastEditedBy.id,
              name:
                article.lastEditorNameSnapshot ||
                article.lastEditedBy.name ||
                'Editor',
              linkedinUrl: article.lastEditedBy.linkedinUrl,
            }
          : article.lastEditorNameSnapshot
            ? {
                id: 'editor-snapshot',
                name: article.lastEditorNameSnapshot,
                linkedinUrl: null,
              }
            : null,
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
      const authorArticles = topic.articles.filter(
        (article) => article.authorId != null,
      );

      const hasPublished = authorArticles.some(
        (article) => article.status === ArticleStatus.PUBLISHED,
      );
      if (hasPublished) {
        return false;
      }

      const activeByOther = authorArticles.some(
        (article) =>
          article.authorId !== authorId &&
          (article.status === ArticleStatus.DRAFT ||
            article.status === ArticleStatus.SUBMITTED ||
            article.status === ArticleStatus.CHANGES_REQUESTED),
      );
      if (activeByOther) {
        return false;
      }

      const myActive = authorArticles.some(
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

  async listMyArticles(userId: string) {
    const include = {
      topic: {
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      },
      author: { select: authorSelect },
      editAssignee: { select: authorSelect },
      editRequestedBy: { select: authorSelect },
    };

    const [writtenBy, editedBy] = await Promise.all([
      this.prisma.article.findMany({
        where: { authorId: userId },
        orderBy: { updatedAt: 'desc' },
        include,
      }),
      this.prisma.article.findMany({
        where: {
          authorId: { not: userId },
          OR: [{ editAssigneeId: userId }, { lastEditedById: userId }],
        },
        orderBy: { updatedAt: 'desc' },
        include,
      }),
    ]);

    const mapArticle = (article: (typeof writtenBy)[number]) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      status: article.status,
      reviewComment: article.reviewComment,
      editRequestedAt: article.editRequestedAt,
      editRequestNote: article.editRequestNote,
      editAssignee: article.editAssignee,
      editorEditedAt: article.editorEditedAt,
      isAssignedToMe:
        article.editAssigneeId === userId && article.authorId !== userId,
      isEditedByMe: article.authorId !== userId,
      canEdit: this.canUserEditArticle(article, userId),
      updatedAt: article.updatedAt,
      submittedAt: article.submittedAt,
      publishedAt: article.publishedAt,
      author: this.mapWorkspaceAuthor(article),
      topic: {
        id: article.topic.id,
        name: article.topic.name,
        slug: article.topic.slug,
        category: article.topic.category,
      },
    });

    return {
      writtenBy: writtenBy.map(mapArticle),
      editedBy: editedBy.map(mapArticle),
    };
  }

  private mapWorkspaceAuthor(article: {
    authorNameSnapshot: string | null;
    authorLinkedinSnapshot: string | null;
    author: {
      id: string;
      name: string | null;
      email: string;
      linkedinUrl: string | null;
    } | null;
  }) {
    if (article.author) {
      return {
        id: article.author.id,
        name: article.authorNameSnapshot || article.author.name,
        email: article.author.email,
        linkedinUrl:
          article.authorLinkedinSnapshot ?? article.author.linkedinUrl,
      };
    }

    if (article.authorNameSnapshot) {
      return {
        id: 'author-snapshot',
        name: article.authorNameSnapshot,
        email: '',
        linkedinUrl: article.authorLinkedinSnapshot,
      };
    }

    return null;
  }

  async getAuthorArticle(articleId: string, userId: string) {
    const article = await this.findArticleForAuthorAccess(articleId, userId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return {
      article: {
        ...article,
        canEdit: this.canUserEditArticle(article, userId),
        isAssignedToMe:
          article.editAssigneeId === userId && article.authorId !== userId,
      },
    };
  }

  async createAuthorArticle(authorId: string, dto: CreateAuthorArticleDto) {
    const article = await this.prisma.$transaction(async (tx) => {
      const topic = await tx.topic.findUnique({
        where: { id: dto.topicId },
        include: {
          articles: {
            where: {
              status: {
                not: ArticleStatus.REJECTED,
              },
            },
          },
        },
      });

      if (!topic || !topic.openForAuthors) {
        throw new NotFoundException('Topic not available for writing');
      }

      if (topic.claimedById && topic.claimedById !== authorId) {
        throw new ForbiddenException(
          'This topic is already claimed by another author',
        );
      }

      const activeArticle = topic.articles.find(
        (article) => article.authorId != null,
      );
      if (activeArticle) {
        throw new ConflictException('This topic already has an active article');
      }

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
    userId: string,
    dto: UpdateAuthorArticleDto,
    editor?: { id: string; role: Role },
  ) {
    const article = await this.findArticleForAuthorAccess(articleId, userId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (!this.canUserEditArticle(article, userId)) {
      throw new ForbiddenException(
        'You do not have permission to edit this article',
      );
    }

    const data: Prisma.ArticleUpdateInput = { ...dto };

    if (editor) {
      data.lastEditedBy = { connect: { id: editor.id } };
      data.lastEditedByRole = editor.role;

      // Credit team editors — anyone saving who is not the original author
      if (article.authorId !== userId) {
        data.editorEditedAt = new Date();
        data.lastEditorNameSnapshot = await this.getEditorSnapshot(userId);
      }
    }

    const updated = await this.prisma.article.update({
      where: { id: articleId },
      data,
    });

    return { article: updated, message: 'Draft saved' };
  }

  async submitAuthorArticle(articleId: string, userId: string) {
    const article = await this.findArticleForAuthorAccess(articleId, userId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (!this.canUserEditArticle(article, userId)) {
      throw new ForbiddenException(
        'Only drafts or revision requests can be submitted',
      );
    }

    const isAssignedRevision =
      article.editAssigneeId === userId && article.authorId !== userId;

    const updated = await this.prisma.article.update({
      where: { id: articleId },
      data: {
        status: ArticleStatus.SUBMITTED,
        submittedAt: new Date(),
        published:
          isAssignedRevision && article.status === ArticleStatus.PUBLISHED
            ? false
            : article.published,
        reviewComment: null,
        editAssigneeId: null,
        editRequestedById: null,
      },
    });

    return { article: updated, message: 'Article submitted for review' };
  }

  async deleteAuthorArticle(articleId: string, userId: string, userRole: Role) {
    const article = await this.prisma.article.findFirst({
      where:
        userRole === Role.ADMIN
          ? { id: articleId }
          : { id: articleId, authorId: userId },
      include: { topic: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (userRole !== Role.ADMIN && article.status !== ArticleStatus.DRAFT) {
      throw new ForbiddenException('You can only delete draft articles');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.article.delete({ where: { id: articleId } });

      const remaining = await tx.article.count({
        where: {
          topicId: article.topicId,
          status: { not: ArticleStatus.REJECTED },
        },
      });

      if (remaining === 0) {
        await tx.topic.update({
          where: { id: article.topicId },
          data: {
            status: TopicStatus.OPEN,
            claimedById: null,
          },
        });
      }
    });

    return { message: 'Article deleted' };
  }

  async requestEditAccess(
    articleId: string,
    authorId: string,
    dto: RequestEditAccessDto,
  ) {
    const article = await this.prisma.article.findFirst({
      where: { id: articleId, authorId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (
      article.status !== ArticleStatus.SUBMITTED &&
      article.status !== ArticleStatus.PUBLISHED
    ) {
      throw new BadRequestException(
        'You can only request edit access for submitted or published articles',
      );
    }

    if (article.editRequestedAt) {
      throw new BadRequestException('An edit request is already pending');
    }

    const note = dto.note?.trim();
    if (!note) {
      throw new BadRequestException(
        'A comment is required when requesting edits',
      );
    }

    const updated = await this.prisma.article.update({
      where: { id: articleId },
      data: {
        editRequestedAt: new Date(),
        editRequestNote: note,
        editRequestedById: authorId,
        editAssigneeId: null,
      },
    });

    return { article: updated, message: 'Edit request sent to admin' };
  }

  async getEditRequestQueue() {
    const articles = await this.prisma.article.findMany({
      where: {
        editRequestedAt: { not: null },
      },
      orderBy: { editRequestedAt: 'asc' },
      include: {
        author: { select: authorSelect },
        editRequestedBy: { select: authorSelect },
        editAssignee: { select: authorSelect },
        topic: {
          include: {
            category: { select: { name: true, slug: true } },
          },
        },
      },
    });

    return { articles };
  }

  async reviewEditRequest(articleId: string, dto: ReviewEditRequestDto) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (!article.editRequestedAt) {
      throw new BadRequestException('This article has no pending edit request');
    }

    if (dto.action === EditRequestReviewAction.APPROVE) {
      const assigneeId = dto.assigneeId?.trim();

      if (!assigneeId) {
        throw new BadRequestException(
          'An editor must be assigned when approving an edit request',
        );
      }

      const assignee = await this.prisma.user.findFirst({
        where: {
          id: assigneeId,
          isActive: true,
          role: { in: [Role.EDITOR, Role.ADMIN] },
        },
      });

      if (!assignee) {
        throw new BadRequestException('Selected editor is not available');
      }

      const updated = await this.prisma.article.update({
        where: { id: articleId },
        data: {
          reviewedAt: new Date(),
          reviewComment:
            dto.comment?.trim() ||
            'Edit access granted. Update the article and submit again for review.',
          editRequestedAt: null,
          editRequestNote: null,
          editRequestedById: null,
          editAssigneeId: assigneeId,
        },
      });

      return { article: updated, message: 'Edit access granted' };
    }

    if (dto.action === EditRequestReviewAction.REJECT) {
      const updated = await this.prisma.article.update({
        where: { id: articleId },
        data: {
          reviewComment:
            dto.comment?.trim() ||
            'Your edit request was declined. Contact admin if you need changes.',
          editRequestedAt: null,
          editRequestNote: null,
          editRequestedById: null,
          editAssigneeId: null,
        },
      });

      return { article: updated, message: 'Edit request declined' };
    }

    throw new BadRequestException('Invalid edit request action');
  }

  async assignEditorToArticle(articleId: string, dto: AssignEditorDto) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (
      article.status !== ArticleStatus.PUBLISHED &&
      article.status !== ArticleStatus.SUBMITTED
    ) {
      throw new BadRequestException(
        'Only published or submitted articles can have an editor assigned',
      );
    }

    if (article.editRequestedAt) {
      throw new BadRequestException(
        'This article has a pending edit request. Resolve it in the review queue first.',
      );
    }

    if (article.editAssigneeId) {
      throw new BadRequestException(
        'An editor is already assigned to this article',
      );
    }

    const assigneeId = dto.assigneeId.trim();
    const assignee = await this.prisma.user.findFirst({
      where: {
        id: assigneeId,
        isActive: true,
        role: { in: [Role.EDITOR, Role.ADMIN] },
      },
    });

    if (!assignee) {
      throw new BadRequestException('Selected team member is not available');
    }

    const updated = await this.prisma.article.update({
      where: { id: articleId },
      data: {
        reviewedAt: new Date(),
        reviewComment:
          dto.comment?.trim() ||
          `Edit access granted to ${assignee.name || assignee.email}. Update the article and submit for review.`,
        editAssigneeId: assigneeId,
        editRequestedAt: null,
        editRequestNote: null,
        editRequestedById: null,
      },
    });

    return {
      article: updated,
      message: `Edit access granted to ${assignee.name || assignee.email}`,
    };
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
            authorNameSnapshot:
              article.authorNameSnapshot ?? snapshots.authorNameSnapshot,
            authorLinkedinSnapshot:
              article.authorLinkedinSnapshot ??
              snapshots.authorLinkedinSnapshot,
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
        throw new BadRequestException(
          'Comment is required when requesting changes',
        );
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
        topics: {
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          select: {
            id: true,
            name: true,
            slug: true,
            published: true,
            openForAuthors: true,
          },
        },
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
    return this.prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id },
        select: { id: true, name: true },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const topics = await tx.topic.findMany({
        where: { categoryId: id },
        select: { id: true },
      });
      const topicIds = topics.map((topic) => topic.id);

      if (topicIds.length > 0) {
        await tx.article.deleteMany({
          where: { topicId: { in: topicIds } },
        });
        await tx.topic.deleteMany({
          where: { categoryId: id },
        });
      }

      await tx.category.delete({ where: { id } });

      return { success: true, category };
    });
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
    return this.prisma.$transaction(async (tx) => {
      const topic = await tx.topic.findUnique({
        where: { id },
        select: { id: true, name: true },
      });

      if (!topic) {
        throw new NotFoundException('Topic not found');
      }

      await tx.article.deleteMany({ where: { topicId: id } });
      await tx.topic.delete({ where: { id } });

      return { success: true, topic };
    });
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

  async getAdminArticle(articleId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: { select: authorSelect },
        topic: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return { article };
  }

  async updateArticle(
    id: string,
    dto: UpdateArticleDto,
    editor?: { id: string; role: Role },
  ) {
    const existing = await this.prisma.article.findUnique({
      where: { id },
      select: {
        authorId: true,
        authorNameSnapshot: true,
        status: true,
        published: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Article not found');
    }

    const data = this.applyEditorAudit({ ...dto }, editor);

    if (dto.published !== undefined) {
      data.status = dto.published
        ? ArticleStatus.PUBLISHED
        : ArticleStatus.DRAFT;
      data.publishedAt = dto.published ? new Date() : null;

      if (dto.published && !existing.authorNameSnapshot) {
        const snapshots = await this.getAuthorSnapshots(existing.authorId);
        data.authorNameSnapshot = snapshots.authorNameSnapshot;
        data.authorLinkedinSnapshot = snapshots.authorLinkedinSnapshot;
      }
    } else if (
      existing.status === ArticleStatus.PUBLISHED &&
      (dto.title !== undefined ||
        dto.slug !== undefined ||
        dto.content !== undefined)
    ) {
      data.status = ArticleStatus.PUBLISHED;
      data.published = true;
    }

    return this.prisma.article
      .update({ where: { id }, data })
      .catch(this.handleNotFound('Article not found'));
  }

  deleteArticle(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const article = await tx.article.findUnique({
        where: { id },
        select: { topicId: true },
      });

      if (!article) {
        throw new NotFoundException('Article not found');
      }

      await tx.article.delete({ where: { id } });

      const remaining = await tx.article.count({
        where: {
          topicId: article.topicId,
          status: { not: ArticleStatus.REJECTED },
        },
      });

      if (remaining === 0) {
        await tx.topic.update({
          where: { id: article.topicId },
          data: { status: TopicStatus.OPEN, claimedById: null },
        });
      }

      return { message: 'Article deleted' };
    });
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
