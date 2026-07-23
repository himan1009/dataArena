-- Align legacy snake_case article columns with Prisma camelCase names.
-- Idempotent: fresh databases already have camelCase from earlier migrations.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'edit_requested_at'
  ) THEN
    ALTER TABLE "articles" RENAME COLUMN "edit_requested_at" TO "editRequestedAt";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'edit_request_note'
  ) THEN
    ALTER TABLE "articles" RENAME COLUMN "edit_request_note" TO "editRequestNote";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'edit_requested_by_id'
  ) THEN
    ALTER TABLE "articles" RENAME COLUMN "edit_requested_by_id" TO "editRequestedById";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'edit_assignee_id'
  ) THEN
    ALTER TABLE "articles" RENAME COLUMN "edit_assignee_id" TO "editAssigneeId";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'last_edited_by_id'
  ) THEN
    ALTER TABLE "articles" RENAME COLUMN "last_edited_by_id" TO "lastEditedById";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'last_edited_by_role'
  ) THEN
    ALTER TABLE "articles" RENAME COLUMN "last_edited_by_role" TO "lastEditedByRole";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'admin_edited_at'
  ) THEN
    ALTER TABLE "articles" RENAME COLUMN "admin_edited_at" TO "adminEditedAt";
  END IF;
END $$;
