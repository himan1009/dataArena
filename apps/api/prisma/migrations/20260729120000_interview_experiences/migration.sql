-- CreateEnum
CREATE TYPE "InterviewExperienceStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'CHANGES_REQUESTED', 'PUBLISHED', 'REJECTED');
CREATE TYPE "InterviewResult" AS ENUM ('SELECTED', 'REJECTED', 'OFFER_DECLINED', 'PENDING', 'WITHDRAWN');
CREATE TYPE "ExperienceLevel" AS ENUM ('FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD');
CREATE TYPE "InterviewRoundType" AS ENUM ('ONLINE_TEST', 'PHONE_SCREEN', 'TECHNICAL', 'SYSTEM_DESIGN', 'HR', 'MANAGERIAL', 'OTHER');
CREATE TYPE "InterviewReportReason" AS ENUM ('INCORRECT_INFO', 'SPAM', 'OFFENSIVE', 'DUPLICATE');

-- CreateTable
CREATE TABLE "interview_experiences" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "interviewYear" INTEGER NOT NULL,
    "location" TEXT,
    "result" "InterviewResult" NOT NULL,
    "overview" TEXT NOT NULL,
    "preparationTips" TEXT NOT NULL,
    "finalAdvice" TEXT NOT NULL,
    "status" "InterviewExperienceStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewComment" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "authorNameSnapshot" TEXT,
    "authorLinkedinSnapshot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_experiences_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "interview_rounds" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "roundType" "InterviewRoundType" NOT NULL,
    "duration" TEXT,
    "difficulty" TEXT,
    "questionsAsked" TEXT NOT NULL,
    "candidateExperience" TEXT NOT NULL,
    "outcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_rounds_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "interview_experience_reports" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "reporterId" TEXT,
    "reason" "InterviewReportReason" NOT NULL,
    "details" TEXT,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_experience_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_experiences_slug_key" ON "interview_experiences"("slug");
CREATE INDEX "interview_experiences_authorId_idx" ON "interview_experiences"("authorId");
CREATE INDEX "interview_experiences_status_idx" ON "interview_experiences"("status");
CREATE INDEX "interview_experiences_company_idx" ON "interview_experiences"("company");
CREATE INDEX "interview_experiences_role_idx" ON "interview_experiences"("role");
CREATE INDEX "interview_experiences_experienceLevel_idx" ON "interview_experiences"("experienceLevel");
CREATE INDEX "interview_experiences_publishedAt_idx" ON "interview_experiences"("publishedAt");
CREATE INDEX "interview_rounds_experienceId_idx" ON "interview_rounds"("experienceId");
CREATE INDEX "interview_experience_reports_experienceId_idx" ON "interview_experience_reports"("experienceId");
CREATE INDEX "interview_experience_reports_status_idx" ON "interview_experience_reports"("status");
CREATE INDEX "interview_experience_reports_createdAt_idx" ON "interview_experience_reports"("createdAt");

-- AddForeignKey
ALTER TABLE "interview_experiences" ADD CONSTRAINT "interview_experiences_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interview_rounds" ADD CONSTRAINT "interview_rounds_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "interview_experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interview_experience_reports" ADD CONSTRAINT "interview_experience_reports_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "interview_experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interview_experience_reports" ADD CONSTRAINT "interview_experience_reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
