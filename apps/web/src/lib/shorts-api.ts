import { fetchWithSessionRefresh } from "@/lib/fetch-client";

export type ShortContentStatus = "ACTIVE" | "INACTIVE";

export type ShortVideoSummary = {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  status: ShortContentStatus;
  sortOrder: number;
};

export type ShortSubtopic = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  videoCount?: number;
  videos?: ShortVideoSummary[];
};

export type ShortTopic = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  status?: ShortContentStatus;
  videoCount?: number;
  subtopics?: ShortSubtopic[];
  _count?: { videos: number; subtopics: number };
};

export type ShortVideo = {
  id: string;
  title: string;
  description?: string | null;
  youtubeUrl: string;
  youtubeVideoId: string;
  sortOrder: number;
};

export class ShortsApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ShortsApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithSessionRefresh(`/api/shorts${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(", ")
          : "Request failed";
    throw new ShortsApiError(message, response.status);
  }

  return data as T;
}

export const shortsApi = {
  adminListTopics: () => request<{ topics: ShortTopic[] }>("/admin/topics"),

  adminCreateTopic: (payload: {
    name: string;
    slug: string;
    description?: string;
  }) =>
    request("/admin/topics", { method: "POST", body: JSON.stringify(payload) }),

  adminCreateSubtopic: (payload: {
    topicId: string;
    name: string;
    slug: string;
  }) =>
    request("/admin/subtopics", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  adminCreateVideo: (payload: {
    subtopicId: string;
    title: string;
    youtubeUrl: string;
    description?: string;
  }) =>
    request("/admin/videos", { method: "POST", body: JSON.stringify(payload) }),

  adminDeleteTopic: (id: string) =>
    request(`/admin/topics/${id}`, { method: "DELETE" }),

  adminDeleteSubtopic: (id: string) =>
    request(`/admin/subtopics/${id}`, { method: "DELETE" }),

  adminDeleteVideo: (id: string) =>
    request(`/admin/videos/${id}`, { method: "DELETE" }),
};
