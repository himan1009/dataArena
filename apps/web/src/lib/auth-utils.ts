import type { AuthUser } from "@/lib/api";

export function canUploadPracticeQuestions(user: AuthUser) {
  const role = normalizeRole(user.role);
  return role === "ADMIN" || Boolean(user.canUploadQuestions);
}

export function isEditorOrAdmin(user: AuthUser) {
  const role = normalizeRole(user.role);
  return role === "EDITOR" || role === "ADMIN";
}

function normalizeRole(role: string | undefined) {
  return role?.trim().toUpperCase() ?? "";
}

export function isAdmin(user: AuthUser) {
  return normalizeRole(user.role) === "ADMIN";
}

/** Creators: editors, admins, and members with practice-upload permission */
export function isCreator(user: AuthUser) {
  return isEditorOrAdmin(user) || canUploadPracticeQuestions(user);
}

export function getAccountTierLabel(user: AuthUser) {
  const role = normalizeRole(user.role);
  if (role === "ADMIN") return "Admin · Creator";
  if (role === "EDITOR") return "Editor · Creator";
  if (canUploadPracticeQuestions(user)) return "Creator";
  return "Member";
}
