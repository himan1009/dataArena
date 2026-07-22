import { fetchWithSessionRefresh } from "@/lib/fetch-client";

export type FeedbackStatus = "NEW" | "READ" | "ARCHIVED";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
};

export type BugReport = {
  id: string;
  name: string;
  email: string;
  area: string;
  pageUrl: string | null;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
};

export class FeedbackApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "FeedbackApiError";
  }
}

async function feedbackRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetchWithSessionRefresh(`/api/feedback${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(", ")
          : "Request failed";
    throw new FeedbackApiError(message, response.status);
  }

  return data as T;
}

export const feedbackApi = {
  submitContact: (payload: { name: string; email: string; message: string }) =>
    feedbackRequest<{ success: boolean; confirmation: string }>("/contact", {
      method: "POST",
      body: payload,
    }),

  submitBug: (payload: {
    name: string;
    email: string;
    area: string;
    pageUrl?: string;
    message: string;
  }) =>
    feedbackRequest<{ success: boolean; confirmation: string }>("/bugs", {
      method: "POST",
      body: payload,
    }),

  listContacts: () =>
    feedbackRequest<{ messages: ContactMessage[] }>("/admin/contacts"),

  listBugs: () => feedbackRequest<{ reports: BugReport[] }>("/admin/bugs"),

  updateContactStatus: (id: string, status: FeedbackStatus) =>
    feedbackRequest(`/admin/contacts/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  updateBugStatus: (id: string, status: FeedbackStatus) =>
    feedbackRequest(`/admin/bugs/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  markContactRead: (id: string) =>
    feedbackRequest(`/admin/contacts/${id}/read`, { method: "PATCH" }),

  markBugRead: (id: string) =>
    feedbackRequest(`/admin/bugs/${id}/read`, { method: "PATCH" }),
};

export const BUG_REPORT_AREAS = [
  "Notes / Reading",
  "Write / Author workspace",
  "Dashboard",
  "Login / Register",
  "Settings",
  "Admin panel",
  "Landing page",
  "Other",
] as const;

export function buildContactReplyMailto(message: ContactMessage) {
  const subject = encodeURIComponent("Re: Your message to DataArena");
  const body = encodeURIComponent(
    `Hi ${message.name},\n\nThank you for contacting DataArena.\n\n\n---\nYour original message (${new Date(message.createdAt).toLocaleString()}):\n${message.message}`,
  );
  return `mailto:${message.email}?subject=${subject}&body=${body}`;
}

export function buildBugReplyMailto(report: BugReport) {
  const subject = encodeURIComponent(`Re: Bug report — ${report.area}`);
  const body = encodeURIComponent(
    `Hi ${report.name},\n\nThanks for reporting this issue.\n\n\n---\nYour bug report (${new Date(report.createdAt).toLocaleString()}):\nArea: ${report.area}\n${report.pageUrl ? `Page: ${report.pageUrl}\n` : ""}\n${report.message}`,
  );
  return `mailto:${report.email}?subject=${subject}&body=${body}`;
}
