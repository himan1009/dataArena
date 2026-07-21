-- AlterTable
ALTER TABLE "articles" ADD COLUMN "editRequestedById" TEXT;
ALTER TABLE "articles" ADD COLUMN "editAssigneeId" TEXT;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_editRequestedById_fkey" FOREIGN KEY ("editRequestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "articles" ADD CONSTRAINT "articles_editAssigneeId_fkey" FOREIGN KEY ("editAssigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
