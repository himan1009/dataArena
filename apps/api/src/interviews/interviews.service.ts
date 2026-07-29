import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ExperienceLevel,
  InterviewExperienceStatus,
  Prisma,
  RoleLevel,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInterviewExperienceDto,
  ReportInterviewExperienceDto,
  ReviewInterviewExperienceDto,
  UpdateInterviewExperienceDto,
} from './dto/interviews.dto';

const authorSelect = {
  id: true,
  name: true,
  email: true,
  linkedinUrl: true,
} as const;

const roundInclude = {
  orderBy: { sortOrder: 'asc' as const },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function mapRoleLevelToExperienceLevel(roleLevel: RoleLevel): ExperienceLevel {
  switch (roleLevel) {
    case RoleLevel.ENTRY:
      return ExperienceLevel.FRESHER;
    case RoleLevel.JUNIOR:
      return ExperienceLevel.JUNIOR;
    case RoleLevel.SENIOR:
      return ExperienceLevel.SENIOR;
    case RoleLevel.LEAD:
    case RoleLevel.STAFF:
      return ExperienceLevel.LEAD;
    case RoleLevel.MID:
    default:
      return ExperienceLevel.MID;
  }
}

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapExperience(
    experience: Prisma.InterviewExperienceGetPayload<{
      include: {
        author: { select: typeof authorSelect };
        rounds: true;
      };
    }>,
  ) {
    return {
      id: experience.id,
      slug: experience.slug,
      title: experience.title,
      company: experience.company,
      role: experience.role,
      experienceLevel: experience.experienceLevel,
      yearsOfExperience: experience.yearsOfExperience,
      roleLevel: experience.roleLevel,
      interviewYear: experience.interviewYear,
      location: experience.location,
      result: experience.result,
      overview: experience.overview,
      preparationTips: experience.preparationTips,
      finalAdvice: experience.finalAdvice,
      status: experience.status,
      reviewComment: experience.reviewComment,
      submittedAt: experience.submittedAt,
      reviewedAt: experience.reviewedAt,
      publishedAt: experience.publishedAt,
      authorNameSnapshot: experience.authorNameSnapshot,
      authorLinkedinSnapshot: experience.authorLinkedinSnapshot,
      updatedAt: experience.updatedAt,
      author: experience.author
        ? {
            id: experience.author.id,
            name: experience.authorNameSnapshot ?? experience.author.name,
            linkedinUrl:
              experience.authorLinkedinSnapshot ?? experience.author.linkedinUrl,
          }
        : null,
      rounds: experience.rounds.map((round) => ({
        id: round.id,
        sortOrder: round.sortOrder,
        name: round.name,
        roundType: round.roundType,
        duration: round.duration,
        difficulty: round.difficulty,
        questionsAsked: round.questionsAsked,
        candidateExperience: round.candidateExperience,
        outcome: round.outcome,
      })),
    };
  }

  private async generateUniqueSlug(company: string, role: string, year: number) {
    const base = slugify(`${company}-${role}-${year}`);
    let slug = base || `experience-${Date.now()}`;
    let suffix = 0;

    while (true) {
      const existing = await this.prisma.interviewExperience.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!existing) {
        return slug;
      }
      suffix += 1;
      slug = `${base}-${suffix}`;
    }
  }

  async listPublished(filters: {
    q?: string;
    company?: string;
    role?: string;
    experienceLevel?: string;
    roleLevel?: string;
  }) {
    const where: Prisma.InterviewExperienceWhereInput = {
      status: InterviewExperienceStatus.PUBLISHED,
    };

    if (filters.company) {
      where.company = { equals: filters.company, mode: 'insensitive' };
    }
    if (filters.role) {
      where.role = { equals: filters.role, mode: 'insensitive' };
    }
    if (filters.experienceLevel) {
      where.experienceLevel =
        filters.experienceLevel as Prisma.EnumExperienceLevelFilter['equals'];
    }
    if (filters.roleLevel) {
      where.roleLevel =
        filters.roleLevel as Prisma.EnumRoleLevelFilter['equals'];
    }
    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { company: { contains: filters.q, mode: 'insensitive' } },
        { role: { contains: filters.q, mode: 'insensitive' } },
        { overview: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    const experiences = await this.prisma.interviewExperience.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    const companies = await this.prisma.interviewExperience.findMany({
      where: { status: InterviewExperienceStatus.PUBLISHED },
      distinct: ['company'],
      select: { company: true },
      orderBy: { company: 'asc' },
    });

    const roles = await this.prisma.interviewExperience.findMany({
      where: { status: InterviewExperienceStatus.PUBLISHED },
      distinct: ['role'],
      select: { role: true },
      orderBy: { role: 'asc' },
    });

    return {
      experiences: experiences.map((experience) => this.mapExperience(experience)),
      companies: companies.map((item) => item.company),
      roles: roles.map((item) => item.role),
    };
  }

  async getPublishedBySlug(slug: string) {
    const experience = await this.prisma.interviewExperience.findFirst({
      where: {
        slug,
        status: InterviewExperienceStatus.PUBLISHED,
      },
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    if (!experience) {
      throw new NotFoundException('Interview experience not found');
    }

    const related = await this.prisma.interviewExperience.findMany({
      where: {
        status: InterviewExperienceStatus.PUBLISHED,
        company: experience.company,
        id: { not: experience.id },
      },
      take: 4,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    return {
      experience: this.mapExperience(experience),
      related: related.map((item) => this.mapExperience(item)),
    };
  }

  async listMine(authorId: string) {
    const experiences = await this.prisma.interviewExperience.findMany({
      where: { authorId },
      orderBy: { updatedAt: 'desc' },
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    const grouped = {
      drafts: experiences.filter((e) => e.status === InterviewExperienceStatus.DRAFT),
      pendingReview: experiences.filter(
        (e) => e.status === InterviewExperienceStatus.SUBMITTED,
      ),
      needsChanges: experiences.filter(
        (e) => e.status === InterviewExperienceStatus.CHANGES_REQUESTED,
      ),
      published: experiences.filter(
        (e) => e.status === InterviewExperienceStatus.PUBLISHED,
      ),
      rejected: experiences.filter(
        (e) => e.status === InterviewExperienceStatus.REJECTED,
      ),
    };

    return {
      experiences: experiences.map((experience) => this.mapExperience(experience)),
      grouped,
    };
  }

  async getMine(id: string, authorId: string) {
    const experience = await this.prisma.interviewExperience.findUnique({
      where: { id },
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    if (!experience || experience.authorId !== authorId) {
      throw new NotFoundException('Interview experience not found');
    }

    return { experience: this.mapExperience(experience) };
  }

  async create(authorId: string, dto: CreateInterviewExperienceDto) {
    const slug = await this.generateUniqueSlug(
      dto.company,
      dto.role,
      dto.interviewYear,
    );

    const experience = await this.prisma.interviewExperience.create({
      data: {
        authorId,
        slug,
        title: dto.title,
        company: dto.company,
        role: dto.role,
        experienceLevel: mapRoleLevelToExperienceLevel(dto.roleLevel),
        yearsOfExperience: dto.yearsOfExperience,
        roleLevel: dto.roleLevel,
        interviewYear: dto.interviewYear,
        location: dto.location,
        result: dto.result,
        overview: dto.overview,
        preparationTips: dto.preparationTips,
        finalAdvice: dto.finalAdvice,
        rounds: {
          create: dto.rounds.map((round, index) => ({
            sortOrder: index,
            name: round.name,
            roundType: round.roundType,
            duration: round.duration,
            difficulty: round.difficulty,
            questionsAsked: round.questionsAsked,
            candidateExperience: round.candidateExperience,
            outcome: round.outcome,
          })),
        },
      },
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    return { experience: this.mapExperience(experience) };
  }

  async update(id: string, authorId: string, dto: UpdateInterviewExperienceDto) {
    const existing = await this.prisma.interviewExperience.findUnique({
      where: { id },
    });

    if (!existing || existing.authorId !== authorId) {
      throw new NotFoundException('Interview experience not found');
    }

    if (
      existing.status !== InterviewExperienceStatus.DRAFT &&
      existing.status !== InterviewExperienceStatus.CHANGES_REQUESTED
    ) {
      throw new ForbiddenException(
        'You can only edit drafts or submissions that need changes',
      );
    }

    const experience = await this.prisma.$transaction(async (tx) => {
      if (dto.rounds) {
        await tx.interviewRound.deleteMany({ where: { experienceId: id } });
      }

      return tx.interviewExperience.update({
        where: { id },
        data: {
          title: dto.title,
          company: dto.company,
          role: dto.role,
          experienceLevel: dto.roleLevel
            ? mapRoleLevelToExperienceLevel(dto.roleLevel)
            : dto.experienceLevel,
          yearsOfExperience: dto.yearsOfExperience,
          roleLevel: dto.roleLevel,
          interviewYear: dto.interviewYear,
          location: dto.location,
          result: dto.result,
          overview: dto.overview,
          preparationTips: dto.preparationTips,
          finalAdvice: dto.finalAdvice,
          ...(dto.rounds
            ? {
                rounds: {
                  create: dto.rounds.map((round, index) => ({
                    sortOrder: index,
                    name: round.name,
                    roundType: round.roundType,
                    duration: round.duration,
                    difficulty: round.difficulty,
                    questionsAsked: round.questionsAsked,
                    candidateExperience: round.candidateExperience,
                    outcome: round.outcome,
                  })),
                },
              }
            : {}),
        },
        include: {
          author: { select: authorSelect },
          rounds: roundInclude,
        },
      });
    });

    return { experience: this.mapExperience(experience) };
  }

  async submit(id: string, authorId: string) {
    const existing = await this.prisma.interviewExperience.findUnique({
      where: { id },
      include: { rounds: true },
    });

    if (!existing || existing.authorId !== authorId) {
      throw new NotFoundException('Interview experience not found');
    }

    if (
      existing.status !== InterviewExperienceStatus.DRAFT &&
      existing.status !== InterviewExperienceStatus.CHANGES_REQUESTED
    ) {
      throw new BadRequestException('Only drafts or change requests can be submitted');
    }

    if (!existing.rounds.length) {
      throw new BadRequestException('Add at least one interview round before submitting');
    }

    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: { name: true, linkedinUrl: true },
    });

    const experience = await this.prisma.interviewExperience.update({
      where: { id },
      data: {
        status: InterviewExperienceStatus.SUBMITTED,
        submittedAt: new Date(),
        reviewComment: null,
        authorNameSnapshot: author?.name ?? null,
        authorLinkedinSnapshot: author?.linkedinUrl ?? null,
      },
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    return {
      experience: this.mapExperience(experience),
      message: 'Submitted for review. We will notify you after admin review.',
    };
  }

  async deleteMine(id: string, authorId: string) {
    const existing = await this.prisma.interviewExperience.findUnique({
      where: { id },
    });

    if (!existing || existing.authorId !== authorId) {
      throw new NotFoundException('Interview experience not found');
    }

    if (existing.status !== InterviewExperienceStatus.DRAFT) {
      throw new ForbiddenException('Only drafts can be deleted by authors');
    }

    await this.prisma.interviewExperience.delete({ where: { id } });
    return { success: true };
  }

  async report(
    slug: string,
    reporterId: string | null,
    dto: ReportInterviewExperienceDto,
  ) {
    const experience = await this.prisma.interviewExperience.findFirst({
      where: {
        slug,
        status: InterviewExperienceStatus.PUBLISHED,
      },
      select: { id: true },
    });

    if (!experience) {
      throw new NotFoundException('Interview experience not found');
    }

    const report = await this.prisma.interviewExperienceReport.create({
      data: {
        experienceId: experience.id,
        reporterId,
        reason: dto.reason,
        details: dto.details,
      },
    });

    return {
      report,
      message: 'Report submitted. Our team will review it.',
    };
  }

  async adminStats() {
    const [pendingReview, published, needsChanges, rejected, reports] =
      await Promise.all([
        this.prisma.interviewExperience.count({
          where: { status: InterviewExperienceStatus.SUBMITTED },
        }),
        this.prisma.interviewExperience.count({
          where: { status: InterviewExperienceStatus.PUBLISHED },
        }),
        this.prisma.interviewExperience.count({
          where: { status: InterviewExperienceStatus.CHANGES_REQUESTED },
        }),
        this.prisma.interviewExperience.count({
          where: { status: InterviewExperienceStatus.REJECTED },
        }),
        this.prisma.interviewExperienceReport.count({
          where: { status: 'NEW' },
        }),
      ]);

    return { pendingReview, published, needsChanges, rejected, reports };
  }

  async adminReviewQueue() {
    const experiences = await this.prisma.interviewExperience.findMany({
      where: {
        status: InterviewExperienceStatus.SUBMITTED,
      },
      orderBy: [{ submittedAt: 'asc' }, { updatedAt: 'asc' }],
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    return { experiences: experiences.map((e) => this.mapExperience(e)) };
  }

  async adminGet(id: string) {
    const experience = await this.prisma.interviewExperience.findUnique({
      where: { id },
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    if (!experience) {
      throw new NotFoundException('Interview experience not found');
    }

    return { experience: this.mapExperience(experience) };
  }

  async adminReview(id: string, dto: ReviewInterviewExperienceDto) {
    const experience = await this.prisma.interviewExperience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException('Interview experience not found');
    }

    if (experience.status !== InterviewExperienceStatus.SUBMITTED) {
      throw new BadRequestException('Only pending submissions can be reviewed');
    }

    let data: Prisma.InterviewExperienceUpdateInput;
    let message: string;

    if (dto.action === 'approve') {
      data = {
        status: InterviewExperienceStatus.PUBLISHED,
        reviewedAt: new Date(),
        publishedAt: new Date(),
        reviewComment: dto.comment ?? null,
      };
      message = 'Interview experience approved and published.';
    } else if (dto.action === 'request_changes') {
      if (!dto.comment?.trim()) {
        throw new BadRequestException('Add a review note when requesting changes');
      }
      data = {
        status: InterviewExperienceStatus.CHANGES_REQUESTED,
        reviewedAt: new Date(),
        reviewComment: dto.comment,
      };
      message = 'Changes requested. The author can update and resubmit.';
    } else {
      data = {
        status: InterviewExperienceStatus.REJECTED,
        reviewedAt: new Date(),
        reviewComment: dto.comment ?? null,
      };
      message = 'Interview experience rejected.';
    }

    const updated = await this.prisma.interviewExperience.update({
      where: { id },
      data,
      include: {
        author: { select: authorSelect },
        rounds: roundInclude,
      },
    });

    return { experience: this.mapExperience(updated), message };
  }

  async adminDelete(id: string) {
    await this.prisma.interviewExperience.delete({ where: { id } });
    return { success: true };
  }

  async adminListReports() {
    const reports = await this.prisma.interviewExperienceReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        experience: {
          select: { id: true, slug: true, title: true, company: true, role: true },
        },
        reporter: { select: authorSelect },
      },
    });

    return { reports };
  }
}
