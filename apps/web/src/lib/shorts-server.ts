import { cookies } from "next/headers";

import type { ShortTopic, ShortVideo } from "@/lib/shorts-api";
import { getBackendUrl } from "@/lib/proxy";

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
    throw new ShortsApiError(
      typeof data.message === "string" ? data.message : "Failed to load shorts",
      response.status,
    );
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
