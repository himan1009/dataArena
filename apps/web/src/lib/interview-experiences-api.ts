import { fetchWithSessionRefresh } from "@/lib/fetch-client";

export type InterviewExperienceStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "CHANGES_REQUESTED"
  | "PUBLISHED"
  | "REJECTED";

export type InterviewResult =
  | "SELECTED"
  | "REJECTED"
  | "OFFER_DECLINED"
  | "PENDING"
  | "WITHDRAWN";

export type ExperienceLevel =
  | "FRESHER"
  | "JUNIOR"
  | "MID"
  | "SENIOR"
  | "LEAD";

export type RoleLevel =
  | "ENTRY"
  | "JUNIOR"
  | "MID"
  | "SENIOR"
  | "LEAD"
  | "STAFF";

export type RoundDifficulty = "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";

export type InterviewRoundType =
  | "ONLINE_TEST"
  | "PHONE_SCREEN"
  | "TECHNICAL"
  | "SYSTEM_DESIGN"
  | "HR"
  | "MANAGERIAL"
  | "OTHER";

export type InterviewReportReason =
  | "INCORRECT_INFO"
  | "SPAM"
  | "OFFENSIVE"
  | "DUPLICATE";

export type InterviewRound = {
  id?: string;
  sortOrder?: number;
  name: string;
  roundType: InterviewRoundType;
  duration?: string | null;
  difficulty?: string | null;
  questionsAsked: string;
  candidateExperience: string;
  outcome?: string | null;
};

export type InterviewExperience = {
  id: string;
  slug: string;
  title: string;
  company: string;
  role: string;
  experienceLevel: ExperienceLevel;
  yearsOfExperience?: string;
  roleLevel?: RoleLevel;
  interviewYear: number;
  location: string | null;
  result: InterviewResult;
  overview: string;
  preparationTips: string;
  finalAdvice: string;
  status: InterviewExperienceStatus;
  reviewComment: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    linkedinUrl: string | null;
  } | null;
  rounds: InterviewRound[];
};

export type InterviewExperiencePayload = {
  title: string;
  company: string;
  role: string;
  experienceLevel?: ExperienceLevel;
  yearsOfExperience: string;
  roleLevel: RoleLevel;
  interviewYear: number;
  location?: string;
  result: InterviewResult;
  overview: string;
  preparationTips: string;
  finalAdvice: string;
  rounds: InterviewRound[];
};

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", body } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetchWithSessionRefresh(`/api/interviews${path}`, {
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
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export const interviewExperiencesApi = {
  listPublished: (params?: {
    q?: string;
    company?: string;
    role?: string;
    experienceLevel?: ExperienceLevel;
  }) => {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.company) search.set("company", params.company);
    if (params?.role) search.set("role", params.role);
    if (params?.experienceLevel) search.set("experienceLevel", params.experienceLevel);
    const query = search.toString();
    return request<{ experiences: InterviewExperience[]; companies: string[]; roles: string[] }>(
      query ? `?${query}` : "",
    );
  },

  getBySlug: (slug: string) =>
    request<{ experience: InterviewExperience; related: InterviewExperience[] }>(
      `/slug/${slug}`,
    ),

  listMine: () =>
    request<{
      experiences: InterviewExperience[];
      grouped: Record<string, InterviewExperience[]>;
    }>("/mine"),

  getMine: (id: string) =>
    request<{ experience: InterviewExperience }>(`/mine/${id}`),

  create: (payload: InterviewExperiencePayload) =>
    request<{ experience: InterviewExperience }>("", {
      method: "POST",
      body: payload,
    }),

  update: (id: string, payload: Partial<InterviewExperiencePayload>) =>
    request<{ experience: InterviewExperience }>(`/mine/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  submit: (id: string) =>
    request<{ experience: InterviewExperience; message: string }>(
      `/mine/${id}/submit`,
      { method: "POST" },
    ),

  delete: (id: string) =>
    request<{ success: boolean }>(`/mine/${id}`, { method: "DELETE" }),

  report: (slug: string, payload: { reason: InterviewReportReason; details?: string }) =>
    request<{ message: string }>(`/slug/${slug}/report`, {
      method: "POST",
      body: payload,
    }),

  adminStats: () =>
    request<{
      pendingReview: number;
      published: number;
      needsChanges: number;
      rejected: number;
      reports: number;
    }>("/admin/stats"),

  adminReviewQueue: () =>
    request<{ experiences: InterviewExperience[] }>("/admin/review-queue"),

  adminReview: (
    id: string,
    payload: { action: "approve" | "reject" | "request_changes"; comment?: string },
  ) =>
    request<{ experience: InterviewExperience; message: string }>(
      `/admin/experiences/${id}/review`,
      { method: "POST", body: payload },
    ),

  adminDelete: (id: string) =>
    request<{ success: boolean }>(`/admin/experiences/${id}`, {
      method: "DELETE",
    }),
};

export const experienceStatusLabels: Record<InterviewExperienceStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Pending review",
  CHANGES_REQUESTED: "Needs changes",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

export const resultLabels: Record<InterviewResult, string> = {
  SELECTED: "Selected",
  REJECTED: "Rejected",
  OFFER_DECLINED: "Offer declined",
  PENDING: "Pending",
  WITHDRAWN: "Withdrawn",
};

export const levelLabels: Record<ExperienceLevel, string> = {
  FRESHER: "Fresher",
  JUNIOR: "Junior",
  MID: "Mid-level",
  SENIOR: "Senior",
  LEAD: "Lead",
};

export const roleLevelLabels: Record<RoleLevel, string> = {
  ENTRY: "Entry",
  JUNIOR: "Junior",
  MID: "Mid-level",
  SENIOR: "Senior",
  LEAD: "Lead",
  STAFF: "Staff / Principal",
};

export const yearsOfExperienceOptions = [
  "0+",
  "1+",
  "2+",
  "3+",
  "4+",
  "5+",
  "6+",
  "7+",
  "8+",
  "9+",
  "10+",
  "12+",
  "15+",
] as const;

export const difficultyLabels: Record<RoundDifficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
  VERY_HARD: "Very hard",
};

export const roundTypeLabels: Record<InterviewRoundType, string> = {
  ONLINE_TEST: "Online test",
  PHONE_SCREEN: "Phone screen",
  TECHNICAL: "Technical",
  SYSTEM_DESIGN: "System design",
  HR: "HR",
  MANAGERIAL: "Managerial",
  OTHER: "Other",
};

export { ApiError as InterviewApiError };
