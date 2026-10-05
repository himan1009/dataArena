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

/** Creators: editors, admins, and members with practice-upload permission */
export function isCreator(user: AuthUser) {
  return isEditorOrAdmin(user) || canUploadPracticeQuestions(user);
}

export function getAccountTierLabel(user: AuthUser) {
  if (user.role === "ADMIN") return "Admin · Creator";
  if (user.role === "EDITOR") return "Editor · Creator";
  if (canUploadPracticeQuestions(user)) return "Creator";
  return "Member";
}
