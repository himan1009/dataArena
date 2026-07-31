import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { protectedRoutes } from "@/config/app-navigation";

const interviewProtectedPrefixes = ["/interviews/share", "/interviews/my"];
const practiceProtectedPrefixes = ["/practice/contribute", "/practice/my"];

function isProtectedRoute(pathname: string) {
  if (
    interviewProtectedPrefixes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return true;
  }

  if (
    practiceProtectedPrefixes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return true;
  }

  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");
  const isAuthenticated = Boolean(accessToken || refreshToken);

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/notes/:path*",
    "/interviews/:path*",
    "/write/:path*",
    "/practice/:path*",
    "/copilot/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
