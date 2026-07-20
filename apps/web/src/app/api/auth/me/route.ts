import { proxyToBackend } from "@/lib/proxy";

export async function GET(request: Request) {
  return proxyToBackend("/auth/me", request);
}
