import type { AuthUser } from "@/lib/api";

export function getAuthGatedHref(user: AuthUser | null, destination: string) {
  if (user) {
    return destination;
  }

  return `/login?from=${encodeURIComponent(destination)}`;
}
