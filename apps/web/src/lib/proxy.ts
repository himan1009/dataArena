const API_BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

export function getBackendUrl(path: string) {
  return `${API_BASE_URL}/api/v1${path}`;
}

export async function proxyToBackend(
  path: string,
  request: Request,
  options: { method?: string; body?: unknown } = {},
) {
  const method = options.method ?? request.method;
  const cookie = request.headers.get("cookie") ?? "";

  const headers: HeadersInit = {
    cookie,
  };

  let body: string | undefined;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  } else if (method !== "GET" && method !== "HEAD") {
    const text = await request.text();
    if (text) {
      headers["Content-Type"] =
        request.headers.get("content-type") ?? "application/json";
      body = text;
    }
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(getBackendUrl(path), {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return Response.json(
      {
        message:
          "Cannot reach the API server. Start it with: cd apps/api && npm run start:dev",
      },
      { status: 503 },
    );
  }

  const responseBody = await backendResponse.text();
  const response = new Response(responseBody, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  });

  const setCookies = backendResponse.headers.getSetCookie?.() ?? [];
  for (const cookieHeader of setCookies) {
    response.headers.append("Set-Cookie", cookieHeader);
  }

  return response;
}
