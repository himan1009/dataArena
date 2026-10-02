export const AUTH_ERROR_CODES = {
  EMAIL_ALREADY_REGISTERED: "EMAIL_ALREADY_REGISTERED",
  INVALID_PASSWORD_EXISTING_ACCOUNT: "INVALID_PASSWORD_EXISTING_ACCOUNT",
} as const;

import { ApiError } from "@/lib/api";

export function getAuthErrorCode(details: unknown): string | null {
  if (!details || typeof details !== "object") {
    return null;
  }

  const record = details as { code?: unknown; message?: unknown };
  if (typeof record.code === "string") {
    return record.code;
  }

  if (record.message && typeof record.message === "object") {
    const nested = record.message as { code?: unknown };
    if (typeof nested.code === "string") {
      return nested.code;
    }
  }

  return null;
}

export function isExistingAccountAuthError(err: unknown): boolean {
  if (!(err instanceof ApiError)) {
    return false;
  }

  const code = getAuthErrorCode(err.details);

  if (
    code === AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED ||
    code === AUTH_ERROR_CODES.INVALID_PASSWORD_EXISTING_ACCOUNT
  ) {
    return true;
  }

  return err.status === 409;
}
