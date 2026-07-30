import { cookies } from "next/headers";

import { getBackendUrl } from "@/lib/proxy";
import type { AdminPracticeCategory, PracticeCategory, PracticeQuestion } from "@/lib/practice-api";

export type PracticeCategoryTopic = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  questionCount: number;
};

export type PracticeCategoryDetail = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  topics: PracticeCategoryTopic[];
};

export type PracticeTopicDetail = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  category: { id: string; name: string; slug: string };
  questions: PracticeQuestion[];
};

export class PracticeApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "PracticeApiError";
  }
}

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function fetchPracticeApi<T>(path: string): Promise<T> {
  const cookieHeader = await getCookieHeader();
  const response = await fetch(getBackendUrl(`/practice${path}`), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new PracticeApiError(
      typeof data.message === "string" ? data.message : "Failed to load practice data",
      response.status,
    );
  }
  return data as T;
}

export async function getPracticeCategories() {
  return fetchPracticeApi<{ categories: PracticeCategory[] }>("/categories");
}

export async function getPracticeCategory(categorySlug: string) {
  return fetchPracticeApi<{ category: PracticeCategoryDetail }>(
    `/categories/${categorySlug}`,
  );
}

export async function getPracticeTopic(categorySlug: string, topicSlug: string) {
  return fetchPracticeApi<{ topic: PracticeTopicDetail }>(
    `/categories/${categorySlug}/topics/${topicSlug}`,
  );
}

export async function getPracticeQuestions(params?: {
  categoryId?: string;
  topicId?: string;
  difficulty?: string;
}) {
  const search = new URLSearchParams();
  if (params?.categoryId) search.set("categoryId", params.categoryId);
  if (params?.topicId) search.set("topicId", params.topicId);
  if (params?.difficulty) search.set("difficulty", params.difficulty);
  const query = search.toString();
  return fetchPracticeApi<{ questions: PracticeQuestion[] }>(
    query ? `/questions?${query}` : "/questions",
  );
}

export async function getAdminPracticeStats() {
  return fetchPracticeApi<{
    categories: number;
    topics: number;
    pendingReview: number;
    published: number;
  }>("/admin/stats");
}

export async function getAdminPracticeReviewQueue() {
  return fetchPracticeApi<{ questions: PracticeQuestion[] }>("/admin/review-queue");
}

export async function getAdminPracticeCategories() {
  return fetchPracticeApi<{ categories: AdminPracticeCategory[] }>("/admin/categories");
}

export async function getPracticeTaxonomy() {
  return fetchPracticeApi<{ categories: PracticeCategory[] }>("/taxonomy");
}

export async function getMyPracticeQuestions() {
  return fetchPracticeApi<{ questions: PracticeQuestion[] }>("/mine/questions");
}
