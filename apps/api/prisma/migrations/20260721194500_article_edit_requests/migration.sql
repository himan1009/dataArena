-- AlterTable
ALTER TABLE "articles" ADD COLUMN "editRequestedAt" TIMESTAMP(3);
ALTER TABLE "articles" ADD COLUMN "editRequestNote" TEXT;
