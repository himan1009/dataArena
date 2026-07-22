import { fetchWithSessionRefresh } from "@/lib/fetch-client";

export type ArticleStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "CHANGES_REQUESTED"
  | "PUBLISHED"
  | "REJECTED";

export type AuthorSummary = {
  id: string;
  name: string | null;
  email: string;
  linkedinUrl: string | null;
  role?: string;
};

export type AvailableTopic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  claimedBy: { id: string; name: string | null } | null;
};

export type MyArticle = {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  reviewComment: string | null;
  editRequestedAt: string | null;
  editRequestNote: string | null;
  editAssignee: AuthorSummary | null;
  author?: AuthorSummary | null;
  isAssignedToMe?: boolean;
  isEditedByMe?: boolean;
  editorEditedAt?: string | null;
  canEdit?: boolean;
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
  topic: {
    id: string;
    name: string;
    slug: string;
    category: { name: string; slug: string };
  };
};

export type ReviewArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: ArticleStatus;
  submittedAt: string | null;
  author: AuthorSummary | null;
  topic: {
    name: string;
    slug: string;
    category: { name: string; slug: string };
  };
};

export type EditRequestArticle = ReviewArticle & {
  editRequestedAt: string;
  editRequestNote: string | null;
  editAssignee: AuthorSummary | null;
  editRequestedBy: AuthorSummary | null;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function notesRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetchWithSessionRefresh(`/api/notes${path}`, {
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
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const notesApi = {
  getAvailableTopics: () =>
    notesRequest<{ topics: AvailableTopic[] }>("/author/topics/available"),

  getMyArticles: () =>
    notesRequest<{ writtenBy: MyArticle[]; editedBy: MyArticle[] }>(
      "/author/articles",
    ),

  getEditors: () =>
    notesRequest<{ editors: AuthorSummary[] }>("/author/editors"),

  getAuthorArticle: (id: string) =>
    notesRequest<{
      article: MyArticle & {
        content: string;
        canEdit?: boolean;
        isAssignedToMe?: boolean;
      };
    }>(`/author/articles/${id}`),

  createArticle: (payload: {
    topicId: string;
    title: string;
    slug: string;
    content: string;
  }) =>
    notesRequest("/author/articles", { method: "POST", body: payload }),

  updateArticle: (
    id: string,
    payload: { title?: string; slug?: string; content?: string },
  ) =>
    notesRequest(`/author/articles/${id}`, { method: "PATCH", body: payload }),

  submitArticle: (id: string) =>
    notesRequest(`/author/articles/${id}/submit`, { method: "POST" }),

  requestEditAccess: (id: string, payload: { note: string }) =>
    notesRequest(`/author/articles/${id}/request-edit`, {
      method: "POST",
      body: payload,
    }),

  getAdminEditors: () =>
    notesRequest<{ editors: AuthorSummary[] }>("/admin/editors"),

  getReviewQueue: () =>
    notesRequest<{ articles: ReviewArticle[] }>("/admin/review-queue"),

  getEditRequestQueue: () =>
    notesRequest<{ articles: EditRequestArticle[] }>("/admin/edit-requests"),

  reviewEditRequest: (
    id: string,
    payload: { action: "approve" | "reject"; comment?: string; assigneeId?: string },
  ) =>
    notesRequest(`/admin/articles/${id}/edit-request/review`, {
      method: "POST",
      body: payload,
    }),

  assignEditor: (
    id: string,
    payload: { assigneeId: string; comment?: string },
  ) =>
    notesRequest(`/admin/articles/${id}/assign-editor`, {
      method: "POST",
      body: payload,
    }),

  reviewArticle: (
    id: string,
    payload: { action: "approve" | "reject" | "request_changes"; comment?: string },
  ) =>
    notesRequest(`/admin/articles/${id}/review`, {
      method: "POST",
      body: payload,
    }),

  createCategory: (payload: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
  }) => notesRequest("/admin/categories", { method: "POST", body: payload }),

  createTopic: (payload: {
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    openForAuthors?: boolean;
  }) => notesRequest("/admin/topics", { method: "POST", body: payload }),

  createArticleAdmin: (payload: {
    topicId: string;
    title: string;
    slug: string;
    content: string;
    published?: boolean;
  }) => notesRequest("/admin/articles", { method: "POST", body: payload }),

  getAdminArticle: (id: string) =>
    notesRequest<{
      article: {
        id: string;
        title: string;
        slug: string;
        content: string;
        status: ArticleStatus;
        topic: {
          name: string;
          slug: string;
          category: { name: string; slug: string };
        };
      };
    }>(`/admin/articles/${id}`),

  updateArticleAdmin: (
    id: string,
    payload: {
      title?: string;
      slug?: string;
      content?: string;
      published?: boolean;
    },
  ) =>
    notesRequest(`/admin/articles/${id}`, { method: "PATCH", body: payload }),

  deleteCategory: (id: string) =>
    notesRequest<{ success: boolean; category: { id: string; name: string } }>(
      `/admin/categories/${id}`,
      { method: "DELETE" },
    ),

  deleteTopic: (id: string) =>
    notesRequest<{ success: boolean; topic: { id: string; name: string } }>(
      `/admin/topics/${id}`,
      { method: "DELETE" },
    ),

  deleteArticleAdmin: (id: string) =>
    notesRequest(`/admin/articles/${id}`, { method: "DELETE" }),

  deleteAuthorArticle: (id: string) =>
    notesRequest(`/author/articles/${id}`, { method: "DELETE" }),
};

export const statusLabels: Record<ArticleStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  CHANGES_REQUESTED: "Changes requested",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

export const statusStyles: Record<ArticleStatus, string> = {
  DRAFT: "bg-white/[0.06] text-muted-foreground",
  SUBMITTED: "bg-amber-500/12 text-amber-200",
  CHANGES_REQUESTED: "bg-orange-500/12 text-orange-200",
  PUBLISHED: "badge-live",
  REJECTED: "bg-destructive/12 text-destructive",
};
