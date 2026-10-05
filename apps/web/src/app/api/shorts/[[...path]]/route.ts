import { proxyToBackend } from "@/lib/proxy";

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handler(request: Request, context: RouteContext) {
  const { path = [] } = await context.params;
  const suffix = path.length ? `/${path.join("/")}` : "";
  return proxyToBackend(`/shorts${suffix}`, request);
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
