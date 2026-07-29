-- CreateEnum
CREATE TYPE "RoleLevel" AS ENUM ('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'STAFF');

-- AlterTable
ALTER TABLE "interview_experiences"
ADD COLUMN "yearsOfExperience" TEXT NOT NULL DEFAULT '1+',
ADD COLUMN "roleLevel" "RoleLevel" NOT NULL DEFAULT 'MID';

-- Backfill role level from legacy experience level where possible
UPDATE "interview_experiences"
SET "roleLevel" = CASE "experienceLevel"
  WHEN 'FRESHER' THEN 'ENTRY'::"RoleLevel"
  WHEN 'JUNIOR' THEN 'JUNIOR'::"RoleLevel"
  WHEN 'MID' THEN 'MID'::"RoleLevel"
  WHEN 'SENIOR' THEN 'SENIOR'::"RoleLevel"
  WHEN 'LEAD' THEN 'LEAD'::"RoleLevel"
  ELSE 'MID'::"RoleLevel"
END;
