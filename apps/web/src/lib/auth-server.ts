import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthUser } from "@/lib/api";
import { applySetCookiesFromResponse } from "@/lib/cookie-utils";
import { getBackendUrl } from "@/lib/proxy";

export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieHeader = await getCookieHeader();

  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(getBackendUrl("/auth/me"), {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (response.ok) {
      const data = (await response.json()) as { user: AuthUser };
      return data.user;
    }

    const refreshResponse = await fetch(getBackendUrl("/auth/refresh"), {
      method: "POST",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!refreshResponse.ok) {
      return null;
    }

    await applySetCookiesFromResponse(refreshResponse);

    const refreshData = (await refreshResponse.json()) as { user: AuthUser };
    return refreshData.user;
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

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}

export async function requireEditor(): Promise<AuthUser> {
  const user = await requireUser();

  if (user.role !== "EDITOR" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}

export function isEditorOrAdmin(user: AuthUser) {
  return user.role === "EDITOR" || user.role === "ADMIN";
}

export function isAdmin(user: AuthUser) {
  return user.role === "ADMIN";
}
