import { proxyToBackend } from "@/lib/proxy";

export async function PATCH(request: Request) {
  return proxyToBackend("/auth/profile", request);
}
