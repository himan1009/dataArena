import { cookies } from "next/headers";

import { getBackendUrl } from "@/lib/proxy";
import type { InterviewExperience } from "@/lib/interview-experiences-api";

class InterviewsApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "InterviewsApiError";
  }
}

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function fetchInterviewsApi<T>(path: string): Promise<T> {
  const cookieHeader = await getCookieHeader();

  const response = await fetch(getBackendUrl(`/interviews${path}`), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : "Failed to load interview experiences";
    throw new InterviewsApiError(message, response.status);
  }

  return data as T;
}

export async function getPublishedExperiences(params?: {
  q?: string;
  company?: string;
  role?: string;
  experienceLevel?: string;
  roleLevel?: string;
}) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.company) search.set("company", params.company);
  if (params?.role) search.set("role", params.role);
  if (params?.experienceLevel) search.set("experienceLevel", params.experienceLevel);
  if (params?.roleLevel) search.set("roleLevel", params.roleLevel);
  const query = search.toString();

  return fetchInterviewsApi<{
    experiences: InterviewExperience[];
    companies: string[];
    roles: string[];
  }>(query ? `?${query}` : "");
}

export async function getExperienceBySlug(slug: string) {
  return fetchInterviewsApi<{
    experience: InterviewExperience;
    related: InterviewExperience[];
  }>(`/slug/${slug}`);
}

export async function getMyExperiences() {
  return fetchInterviewsApi<{
    experiences: InterviewExperience[];
    grouped: Record<string, InterviewExperience[]>;
  }>("/mine");
}

export async function getAdminInterviewReviewQueue() {
  return fetchInterviewsApi<{ experiences: InterviewExperience[] }>(
    "/admin/review-queue",
  );
}

export async function getAdminInterviewStats() {
  return fetchInterviewsApi<{
    pendingReview: number;
    published: number;
    needsChanges: number;
    rejected: number;
    reports: number;
  }>("/admin/stats");
}

export { InterviewsApiError };
