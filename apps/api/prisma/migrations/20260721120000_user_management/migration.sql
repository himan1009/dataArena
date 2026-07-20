-- AlterTable
ALTER TABLE "users" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "deactivatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "articles" ADD COLUMN "authorNameSnapshot" TEXT;
ALTER TABLE "articles" ADD COLUMN "authorLinkedinSnapshot" TEXT;

-- Backfill author snapshots for already published articles
UPDATE "articles" AS a
SET
  "authorNameSnapshot" = COALESCE(u."name", split_part(u."email", '@', 1)),
  "authorLinkedinSnapshot" = u."linkedinUrl"
FROM "users" AS u
WHERE a."authorId" = u."id"
  AND a."status" = 'PUBLISHED'
  AND a."authorNameSnapshot" IS NULL;
