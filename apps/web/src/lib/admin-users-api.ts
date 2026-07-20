import { ApiError } from "@/lib/notes-api";

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "EDITOR" | "ADMIN";
  linkedinUrl: string | null;
  isActive: boolean;
  deactivatedAt: string | null;
  createdAt: string;
  publishedArticleCount: number;
};

async function adminUsersRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetch(`/api/admin/users${path}`, {
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
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const adminUsersApi = {
  listUsers: () => adminUsersRequest<{ users: AdminUser[] }>(""),

  updateRole: (userId: string, role: "USER" | "EDITOR") =>
    adminUsersRequest(`/${userId}/role`, {
      method: "PATCH",
      body: { role },
    }),

  updateStatus: (userId: string, isActive: boolean) =>
    adminUsersRequest(`/${userId}/status`, {
      method: "PATCH",
      body: { isActive },
    }),
};
