import { fetchWithSessionRefresh } from "@/lib/fetch-client";

export type WritingStandardKey = "MANDATORY" | "ESSENTIAL";

export type WritingStandard = {
  id: string;
  key: WritingStandardKey;
  title: string;
  content: string;
  updatedAt: string;
  updatedByName: string | null;
};

export class StandardsApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "StandardsApiError";
  }
}

async function standardsRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetchWithSessionRefresh(`/api/standards${path}`, {
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
    throw new StandardsApiError(message, response.status);
  }

  return data as T;
}

export const standardsApi = {
  list: () =>
    standardsRequest<{ standards: WritingStandard[] }>(""),

  get: (key: WritingStandardKey) =>
    standardsRequest<{ standard: WritingStandard }>(`/${key}`),

  update: (
    key: WritingStandardKey,
    payload: { title?: string; content?: string },
  ) =>
    standardsRequest<{ standard: WritingStandard }>(`/${key}`, {
      method: "PUT",
      body: payload,
    }),
};

export const WRITING_STANDARD_LABELS: Record<WritingStandardKey, string> = {
  MANDATORY: "Mandatory standards",
  ESSENTIAL: "Essential guidelines",
};
