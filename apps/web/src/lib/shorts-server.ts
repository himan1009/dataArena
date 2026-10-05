import { cookies } from "next/headers";

import type { ShortTopic, ShortVideo } from "@/lib/shorts-api";
import { getBackendUrl } from "@/lib/proxy";

function formatShortsApiMessage(data: unknown, status: number): string {
  if (data && typeof data === "object" && "message" in data) {
    const raw = (data as { message?: unknown }).message;
    if (typeof raw === "string" && raw.trim()) return raw;
    if (Array.isArray(raw)) return raw.join(", ");
  }

  if (status === 401) {
    return "Sign in again to load short videos.";
  }
  if (status === 403) {
    return "Admin access required. Log in as an admin account.";
  }
  if (status === 503) {
    return "Cannot reach the API server. Wake Render or check API_URL on Vercel.";
  }

  return "Failed to load shorts. Ensure the API is deployed and migrations have run.";
}

export class ShortsApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ShortsApiError";
  }
}

async function fetchShortsApi<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(getBackendUrl(`/shorts${path}`), {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = formatShortsApiMessage(data, response.status);
    throw new ShortsApiError(message, response.status);
  }

  return data as T;
}

export async function getShortTopics() {
  return fetchShortsApi<{ topics: ShortTopic[] }>("/topics");
}

export async function getShortTopic(topicSlug: string) {
  return fetchShortsApi<{ topic: ShortTopic }>(`/topics/${topicSlug}`);
}

export type ShortSubtopicDetail = {
  id: string;
  name: string;
  slug: string;
  topic: { id: string; name: string; slug: string };
  videos: ShortVideo[];
};

export async function getShortSubtopic(topicSlug: string, subtopicSlug: string) {
  return fetchShortsApi<{ subtopic: ShortSubtopicDetail }>(
    `/topics/${topicSlug}/subtopics/${subtopicSlug}`,
  );
}

export async function getAdminShortTopics() {
  return fetchShortsApi<{ topics: ShortTopic[] }>("/admin/topics");
}
