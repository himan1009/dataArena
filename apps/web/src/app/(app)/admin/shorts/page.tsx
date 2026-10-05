import Link from "next/link";
import { Clapperboard } from "lucide-react";

import { AdminShortsPanel } from "@/components/shorts/admin-shorts-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-server";
import { getAdminShortTopics, ShortsApiError } from "@/lib/shorts-server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Shorts CMS",
};

export default async function AdminShortsPage() {
  await requireAdmin();

  let topics: Awaited<ReturnType<typeof getAdminShortTopics>>["topics"] = [];
  let loadError: string | null = null;
  let loadStatus: number | null = null;

  try {
    const data = await getAdminShortTopics();
    topics = data.topics;
  } catch (error) {
    if (error instanceof ShortsApiError) {
      loadError = error.message;
      loadStatus = error.status;
    } else {
      throw error;
    }
  }

  return (
    <AppPage>
      <PageIntro
        icon={Clapperboard}
        label="Admin"
        title="Shorts CMS"
        description="Create topics and subtopics, paste YouTube Shorts links, and manage the library."
      />

      {loadError && (
        <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-4 text-sm text-destructive">
          <p className="font-medium">Could not load topics from the API</p>
          <p>{loadError}</p>
          {loadStatus === 403 && (
            <p className="text-destructive/90">
              Tip: log out and log back in if your account was recently made admin.
            </p>
          )}
          {(loadStatus === 500 || loadStatus === 400) && (
            <p className="text-destructive/90">
              On Render, redeploy the API so migration{" "}
              <code className="rounded bg-black/20 px-1">20261005120000_short_videos_module</code>{" "}
              runs (<code className="rounded bg-black/20 px-1">prisma migrate deploy</code>).
            </p>
          )}
        </div>
      )}

      <div className="glass-panel space-y-2 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Quick links</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            Member view:{" "}
            <Link href="/shorts" className="text-primary hover:underline">
              /shorts
            </Link>
          </li>
          <li>Paste any public YouTube Shorts / watch URL when adding a video.</li>
        </ul>
        <Link href="/shorts" className={cn(buttonVariants({ variant: "outline" }), "mt-3 w-fit")}>
          Open Shorts library
        </Link>
      </div>

      <AdminShortsPanel topics={topics} apiUnavailable={Boolean(loadError)} />
    </AppPage>
  );
}
