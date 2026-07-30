import { fetchWithSessionRefresh } from "@/lib/fetch-client";

export type PracticeContentStatus = "ACTIVE" | "INACTIVE";
export type PracticeQuestionStatus = "DRAFT" | "SUBMITTED" | "PUBLISHED" | "REJECTED";
export type PracticeDifficulty = "EASY" | "MEDIUM" | "HARD";
export type PracticePlatform = "LEETCODE";

export type PracticeSubtopic = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  status: PracticeContentStatus;
};

export type PracticeTopic = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  status: PracticeContentStatus;
  subtopics?: PracticeSubtopic[];
  _count?: { questions: number };
};

export type AdminPracticeQuestionSummary = {
  id: string;
  title: string;
  status: PracticeQuestionStatus;
  difficulty: PracticeDifficulty;
  sortOrder: number;
};

export type AdminPracticeTopic = PracticeTopic & {
  questions?: AdminPracticeQuestionSummary[];
};

export type PracticeCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  status: PracticeContentStatus;
  topics?: PracticeTopic[];
  _count?: { questions: number };
};

export type AdminPracticeCategory = Omit<PracticeCategory, "topics" | "_count"> & {
  topics?: AdminPracticeTopic[];
  _count?: { questions: number; topics: number };
};

export type PracticeQuestion = {
  id: string;
  title: string;
  platform: PracticePlatform;
  questionUrl: string;
  difficulty: PracticeDifficulty;
  companyTags: string[];
  estimatedTime?: string | null;
  description?: string | null;
  publishedAt?: string | null;
  sortOrder?: number;
  addedBy?: string | null;
  category: { id: string; name: string; slug: string };
  topic: { id: string; name: string; slug: string };
  subtopic?: { id: string; name: string; slug: string } | null;
  status?: PracticeQuestionStatus;
  reviewComment?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  approvedByNameSnapshot?: string | null;
  authorNameSnapshot?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PracticeQuestionPayload = {
  title: string;
  platform: PracticePlatform;
  questionUrl: string;
  difficulty: PracticeDifficulty;
  topicId: string;
  categoryId?: string;
  companyTags?: string[];
  estimatedTime?: string;
  description?: string;
};

class PracticeApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "PracticeApiError";
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", body } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetchWithSessionRefresh(`/api/practice${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(", ")
          : "Request failed";
    throw new PracticeApiError(message, response.status);
  }

  return data as T;
}

export const practiceApi = {
  listCategories: () => request<{ categories: PracticeCategory[] }>("/categories"),

  listQuestions: (params?: {
    categoryId?: string;
    topicId?: string;
    subtopicId?: string;
    difficulty?: PracticeDifficulty;
  }) => {
    const search = new URLSearchParams();
    if (params?.categoryId) search.set("categoryId", params.categoryId);
    if (params?.topicId) search.set("topicId", params.topicId);
    if (params?.subtopicId) search.set("subtopicId", params.subtopicId);
    if (params?.difficulty) search.set("difficulty", params.difficulty);
    const query = search.toString();
    return request<{ questions: PracticeQuestion[] }>(query ? `/questions?${query}` : "/questions");
  },

  listTaxonomy: () => request<{ categories: PracticeCategory[] }>("/taxonomy"),

  listMine: () => request<{ questions: PracticeQuestion[] }>("/mine/questions"),

  create: (payload: PracticeQuestionPayload) =>
    request<{ question: PracticeQuestion }>("/mine/questions", {
      method: "POST",
      body: payload,
    }),

  createAndSubmit: (payload: PracticeQuestionPayload) =>
    request<{ question: PracticeQuestion }>("/mine/questions/submit", {
      method: "POST",
      body: payload,
    }),

  update: (id: string, payload: Partial<PracticeQuestionPayload>) =>
    request<{ question: PracticeQuestion }>(`/mine/questions/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  submit: (id: string) =>
    request<{ question: PracticeQuestion }>(`/mine/questions/${id}/submit`, {
      method: "POST",
    }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/mine/questions/${id}`, { method: "DELETE" }),

  adminStats: () =>
    request<{ categories: number; topics: number; pendingReview: number; published: number }>(
      "/admin/stats",
    ),

  adminReviewQueue: () =>
    request<{ questions: PracticeQuestion[] }>("/admin/review-queue"),

  adminReview: (id: string, payload: { action: "approve" | "reject"; comment?: string }) =>
    request<{ question: PracticeQuestion }>(`/admin/questions/${id}/review`, {
      method: "POST",
      body: payload,
    }),

  adminListCategories: () =>
    request<{ categories: PracticeCategory[] }>("/admin/categories"),

  adminCreateCategory: (payload: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
    status?: PracticeContentStatus;
  }) => request("/admin/categories", { method: "POST", body: payload }),

  adminCreateTopic: (payload: {
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
    status?: PracticeContentStatus;
  }) => request("/admin/topics", { method: "POST", body: payload }),

  adminDeleteCategory: (id: string) =>
    request<{ success: boolean }>(`/admin/categories/${id}`, { method: "DELETE" }),

  adminDeleteTopic: (id: string) =>
    request<{ success: boolean }>(`/admin/topics/${id}`, { method: "DELETE" }),

  adminDeleteQuestion: (id: string) =>
    request<{ success: boolean }>(`/admin/questions/${id}`, { method: "DELETE" }),
};

export const difficultyLabels: Record<PracticeDifficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export const platformLabels: Record<PracticePlatform, string> = {
  LEETCODE: "LeetCode",
};

export const questionStatusLabels: Record<PracticeQuestionStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Pending review",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

export { PracticeApiError };
