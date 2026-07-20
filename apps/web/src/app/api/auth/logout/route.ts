import { proxyToBackend } from "@/lib/proxy";

export async function POST(request: Request) {
  return proxyToBackend("/auth/logout", request);
}
