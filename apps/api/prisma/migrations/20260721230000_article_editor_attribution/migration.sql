-- AlterTable
ALTER TABLE "articles" ADD COLUMN "editorEditedAt" TIMESTAMP(3);
ALTER TABLE "articles" ADD COLUMN "lastEditorNameSnapshot" TEXT;
