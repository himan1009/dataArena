import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthUser } from "@/lib/api";
import { getBackendUrl } from "@/lib/proxy";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(getBackendUrl("/auth/me"), {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!response.ok) {
      const refreshResponse = await fetch(getBackendUrl("/auth/refresh"), {
        method: "POST",
        headers: { cookie: cookieHeader },
        cache: "no-store",
      });

      if (!refreshResponse.ok) {
        return null;
      }

      const refreshData = (await refreshResponse.json()) as { user: AuthUser };
      return refreshData.user;
    }

    const data = (await response.json()) as { user: AuthUser };
    return data.user;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
