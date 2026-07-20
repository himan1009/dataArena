import { proxyToBackend } from "@/lib/proxy";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function handler(request: Request, context: RouteContext) {
  const { path = [] } = await context.params;
  const suffix = path.length > 0 ? `/${path.join("/")}` : "";
  return proxyToBackend(`/notes${suffix}`, request);
}

export async function GET(request: Request, context: RouteContext) {
  return handler(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handler(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return handler(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handler(request, context);
}
