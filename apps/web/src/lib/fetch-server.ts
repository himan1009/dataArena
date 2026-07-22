import { getBackendUrl } from "@/lib/proxy";
import { getCookieHeader } from "@/lib/auth-server";

export class ServerFetchError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ServerFetchError";
  }
}

export async function fetchWithAuth<T = unknown>(
  path: string,
  cookieHeader?: string,
): Promise<T> {
  const header = cookieHeader ?? (await getCookieHeader());
  const response = await fetch(getBackendUrl(path), {
    headers: { cookie: header },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = (await response.json()) as { message?: string | string[] };
      if (typeof data.message === "string") {
        message = data.message;
      } else if (Array.isArray(data.message)) {
        message = data.message.join(", ");
      }
    } catch {
      // Keep default message when body is not JSON.
    }

    throw new ServerFetchError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export async function fetchAuthorData<T = unknown>(path: string) {
  return fetchWithAuth<T>(`/notes${path}`);
}

export async function fetchAdminData<T = unknown>(path: string) {
  return fetchWithAuth<T>(path);
}
