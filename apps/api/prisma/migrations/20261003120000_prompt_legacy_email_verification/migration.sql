-- First email-auth migration marked every existing user verified so they would not be locked out.
-- Product requirement: legacy users should still see the verify prompt until they confirm email.
-- New signups already have emailVerified = false; this only resets the one-time auto-verify grant.
UPDATE "users" SET "emailVerified" = false WHERE "emailVerified" = true;
