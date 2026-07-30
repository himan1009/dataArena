-- AlterTable
ALTER TABLE "practice_questions" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "practice_questions_topicId_sortOrder_idx" ON "practice_questions"("topicId", "sortOrder");
