-- CreateEnum
CREATE TYPE "PracticeContentStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "PracticeQuestionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PUBLISHED', 'REJECTED');
CREATE TYPE "PracticeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE "PracticePlatform" AS ENUM ('LEETCODE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "canUploadQuestions" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "practice_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PracticeContentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "practice_topics" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PracticeContentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_topics_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "practice_subtopics" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PracticeContentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_subtopics_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "practice_questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" "PracticePlatform" NOT NULL DEFAULT 'LEETCODE',
    "questionUrl" TEXT NOT NULL,
    "difficulty" "PracticeDifficulty" NOT NULL,
    "categoryId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subtopicId" TEXT,
    "companyTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estimatedTime" TEXT,
    "description" TEXT,
    "status" "PracticeQuestionStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewComment" TEXT,
    "authorId" TEXT NOT NULL,
    "authorNameSnapshot" TEXT,
    "approvedById" TEXT,
    "approvedByNameSnapshot" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "practice_categories_slug_key" ON "practice_categories"("slug");
CREATE INDEX "practice_categories_status_idx" ON "practice_categories"("status");
CREATE INDEX "practice_categories_sortOrder_idx" ON "practice_categories"("sortOrder");
CREATE UNIQUE INDEX "practice_topics_categoryId_slug_key" ON "practice_topics"("categoryId", "slug");
CREATE INDEX "practice_topics_categoryId_idx" ON "practice_topics"("categoryId");
CREATE INDEX "practice_topics_status_idx" ON "practice_topics"("status");
CREATE UNIQUE INDEX "practice_subtopics_topicId_slug_key" ON "practice_subtopics"("topicId", "slug");
CREATE INDEX "practice_subtopics_topicId_idx" ON "practice_subtopics"("topicId");
CREATE INDEX "practice_questions_categoryId_idx" ON "practice_questions"("categoryId");
CREATE INDEX "practice_questions_topicId_idx" ON "practice_questions"("topicId");
CREATE INDEX "practice_questions_subtopicId_idx" ON "practice_questions"("subtopicId");
CREATE INDEX "practice_questions_authorId_idx" ON "practice_questions"("authorId");
CREATE INDEX "practice_questions_status_idx" ON "practice_questions"("status");
CREATE INDEX "practice_questions_difficulty_idx" ON "practice_questions"("difficulty");
CREATE INDEX "practice_questions_publishedAt_idx" ON "practice_questions"("publishedAt");

-- AddForeignKey
ALTER TABLE "practice_topics" ADD CONSTRAINT "practice_topics_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "practice_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "practice_subtopics" ADD CONSTRAINT "practice_subtopics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "practice_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "practice_questions" ADD CONSTRAINT "practice_questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "practice_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "practice_questions" ADD CONSTRAINT "practice_questions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "practice_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "practice_questions" ADD CONSTRAINT "practice_questions_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "practice_subtopics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "practice_questions" ADD CONSTRAINT "practice_questions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "practice_questions" ADD CONSTRAINT "practice_questions_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
