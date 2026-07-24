-- Additive only: admin assigns which editor may write each topic.
ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "assignedAuthorId" TEXT;

CREATE INDEX IF NOT EXISTS "topics_assignedAuthorId_idx" ON "topics"("assignedAuthorId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'topics_assignedAuthorId_fkey'
  ) THEN
    ALTER TABLE "topics"
      ADD CONSTRAINT "topics_assignedAuthorId_fkey"
      FOREIGN KEY ("assignedAuthorId") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Backfill: topics with an active author article keep that writer assigned (no data loss).
UPDATE "topics" t
SET "assignedAuthorId" = sub."authorId"
FROM (
  SELECT DISTINCT ON (a."topicId")
    a."topicId",
    a."authorId"
  FROM "articles" a
  WHERE a."authorId" IS NOT NULL
    AND a."status" IN ('DRAFT', 'SUBMITTED', 'CHANGES_REQUESTED')
  ORDER BY a."topicId", a."updatedAt" DESC
) sub
WHERE t."id" = sub."topicId"
  AND t."assignedAuthorId" IS NULL;
