import { proxyToBackend } from "@/lib/proxy";

export async function POST(request: Request) {
  return proxyToBackend("/auth/forgot-password", request);
}
