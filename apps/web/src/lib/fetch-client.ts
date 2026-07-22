const AUTH_RETRY_HEADER = "x-auth-retry";

export async function fetchWithSessionRefresh(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  let response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status !== 401 || headers.has(AUTH_RETRY_HEADER)) {
    return response;
  }

  const refreshResponse = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshResponse.ok) {
    return response;
  }

  const retryHeaders = new Headers(init.headers);
  retryHeaders.set(AUTH_RETRY_HEADER, "1");

  return fetch(input, {
    ...init,
    headers: retryHeaders,
    credentials: "include",
  });
}
