import { NextResponse } from "next/server";

import { fetchWithTimeout } from "@/lib/fetch-timeout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Vercel Cron (optional): pings Render API `/health/ready` every ~8 minutes.
 * Set CRON_SECRET in Vercel and add vercel.json cron — see docs/DEPLOYMENT.md.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && !cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is required in production" },
      { status: 503 },
    );
  }

  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const apiBase = process.env.API_URL?.replace(/\/$/, "");
  if (!apiBase) {
    return NextResponse.json(
      { error: "API_URL is not configured" },
      { status: 500 },
    );
  }

  const healthUrl = `${apiBase}/api/v1/health/ready`;

  try {
    const response = await fetchWithTimeout(
      healthUrl,
      { method: "GET", cache: "no-store" },
      90_000,
    );

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          healthUrl,
          status: response.status,
          body,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      healthUrl,
      api: body,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "keepalive_request_failed";

    return NextResponse.json(
      { ok: false, healthUrl, error: message },
      { status: 502 },
    );
  }
}
