-- AlterTable
ALTER TABLE "articles" ADD COLUMN "lastEditedById" TEXT;
ALTER TABLE "articles" ADD COLUMN "lastEditedByRole" "Role";
ALTER TABLE "articles" ADD COLUMN "adminEditedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
