import { proxyToBackend } from "@/lib/proxy";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function handler(request: Request, context: RouteContext) {
  const { path = [] } = await context.params;
  const suffix = path.length > 0 ? `/${path.join("/")}` : "";
  return proxyToBackend(`/standards${suffix}`, request);
}

export async function GET(request: Request, context: RouteContext) {
  return handler(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handler(request, context);
}
