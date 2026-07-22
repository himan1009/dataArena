-- CreateEnum
CREATE TYPE "WritingStandardKey" AS ENUM ('MANDATORY', 'ESSENTIAL');

-- CreateTable
CREATE TABLE "writing_standards" (
    "id" TEXT NOT NULL,
    "key" "WritingStandardKey" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "writing_standards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "writing_standards_key_key" ON "writing_standards"("key");

-- AddForeignKey
ALTER TABLE "writing_standards" ADD CONSTRAINT "writing_standards_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
