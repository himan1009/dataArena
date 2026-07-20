-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'CHANGES_REQUESTED', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'EDITOR';

-- AlterTable
ALTER TABLE "users" ADD COLUMN "linkedinUrl" TEXT;

-- AlterTable
ALTER TABLE "topics" ADD COLUMN "openForAuthors" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "topics" ADD COLUMN "status" "TopicStatus" NOT NULL DEFAULT 'OPEN';
ALTER TABLE "topics" ADD COLUMN "claimedById" TEXT;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN "authorId" TEXT;
ALTER TABLE "articles" ADD COLUMN "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "articles" ADD COLUMN "reviewComment" TEXT;
ALTER TABLE "articles" ADD COLUMN "submittedAt" TIMESTAMP(3);
ALTER TABLE "articles" ADD COLUMN "reviewedAt" TIMESTAMP(3);
ALTER TABLE "articles" ADD COLUMN "publishedAt" TIMESTAMP(3);

-- Migrate existing published articles
UPDATE "articles" SET "status" = 'PUBLISHED', "publishedAt" = "updatedAt" WHERE "published" = true;

-- CreateIndex
CREATE INDEX "topics_claimedById_idx" ON "topics"("claimedById");
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
