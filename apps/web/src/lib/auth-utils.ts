import type { AuthUser } from "@/lib/api";

export function canUploadPracticeQuestions(user: AuthUser) {
  return user.role === "ADMIN" || Boolean(user.canUploadQuestions);
}

export function isEditorOrAdmin(user: AuthUser) {
  return user.role === "EDITOR" || user.role === "ADMIN";
}

export function isAdmin(user: AuthUser) {
  return user.role === "ADMIN";
}
