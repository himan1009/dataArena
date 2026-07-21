-- Align article column names with Prisma camelCase convention used by earlier migrations.

ALTER TABLE "articles" RENAME COLUMN "edit_requested_at" TO "editRequestedAt";
ALTER TABLE "articles" RENAME COLUMN "edit_request_note" TO "editRequestNote";
ALTER TABLE "articles" RENAME COLUMN "edit_requested_by_id" TO "editRequestedById";
ALTER TABLE "articles" RENAME COLUMN "edit_assignee_id" TO "editAssigneeId";
ALTER TABLE "articles" RENAME COLUMN "last_edited_by_id" TO "lastEditedById";
ALTER TABLE "articles" RENAME COLUMN "last_edited_by_role" TO "lastEditedByRole";
ALTER TABLE "articles" RENAME COLUMN "admin_edited_at" TO "adminEditedAt";
