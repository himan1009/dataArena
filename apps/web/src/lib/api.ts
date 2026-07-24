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

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers } = options;

  const response = await fetch(`/api/auth${path.replace("/auth", "")}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
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
          : typeof data.error === "string"
            ? data.error
            : response.status === 522 ||
                response.status === 502 ||
                response.status === 504
              ? "API server timed out (often asleep on Render free tier). Open your API URL in a new tab, wait up to 60 seconds, then try login again."
              : response.status === 503
                ? "Cannot reach the API server. If using production, wake Render first. If local, run: cd apps/api && npm run start:dev"
                : response.status === 500
                  ? "Server error. Check Render logs or run database migrations."
                  : "Request failed";

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  linkedinUrl?: string | null;
  createdAt?: string;
};

export type AuthResponse = {
  user: AuthUser;
  message: string;
};

export const authApi = {
  register: (payload: { email: string; password: string; name?: string }) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: payload,
    }),

  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    }),

  logout: () =>
    apiRequest<{ message: string }>("/auth/logout", {
      method: "POST",
    }),

  refresh: () =>
    apiRequest<AuthResponse>("/auth/refresh", {
      method: "POST",
    }),

  me: () => apiRequest<{ user: AuthUser }>("/auth/me"),

  updateProfile: (payload: { linkedinUrl?: string }) =>
    apiRequest<{ user: AuthUser; message: string }>("/auth/profile", {
      method: "PATCH",
      body: payload,
    }),
};
