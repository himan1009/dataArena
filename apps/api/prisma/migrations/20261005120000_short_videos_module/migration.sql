-- CreateEnum
CREATE TYPE "ShortContentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "short_topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ShortContentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "short_topics_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "short_subtopics" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ShortContentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "short_subtopics_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "short_videos" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subtopicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeUrl" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ShortContentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "short_videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "short_topics_slug_key" ON "short_topics"("slug");
CREATE INDEX "short_topics_status_idx" ON "short_topics"("status");
CREATE INDEX "short_topics_sortOrder_idx" ON "short_topics"("sortOrder");
CREATE UNIQUE INDEX "short_subtopics_topicId_slug_key" ON "short_subtopics"("topicId", "slug");
CREATE INDEX "short_subtopics_topicId_idx" ON "short_subtopics"("topicId");
CREATE INDEX "short_videos_topicId_idx" ON "short_videos"("topicId");
CREATE INDEX "short_videos_subtopicId_idx" ON "short_videos"("subtopicId");
CREATE INDEX "short_videos_status_idx" ON "short_videos"("status");
CREATE INDEX "short_videos_subtopicId_sortOrder_idx" ON "short_videos"("subtopicId", "sortOrder");

-- AddForeignKey
ALTER TABLE "short_subtopics" ADD CONSTRAINT "short_subtopics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "short_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "short_videos" ADD CONSTRAINT "short_videos_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "short_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "short_videos" ADD CONSTRAINT "short_videos_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "short_subtopics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
