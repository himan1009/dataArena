import Link from "next/link";
import { BookOpen, ClipboardCheck, UserPen } from "lucide-react";

import { AdminLoadError } from "@/components/admin/admin-load-error";
import { AdminNotesPanel } from "@/components/admin/admin-notes-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-server";
import { getAdminCategories, getAdminNotesStats, NotesApiError } from "@/lib/notes-server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Articles CMS",
};

export default async function AdminArticlesPage() {
  await requireAdmin();

  let categories: Awaited<ReturnType<typeof getAdminCategories>> = [];
  let stats: Awaited<ReturnType<typeof getAdminNotesStats>> | null = null;
  let loadError: string | null = null;

  try {
    [categories, stats] = await Promise.all([
      getAdminCategories(),
      getAdminNotesStats(),
    ]);
  } catch (error) {
    loadError =
      error instanceof NotesApiError
        ? error.message
        : "Failed to load articles CMS data from the API.";
  }

  return (
    <AppPage>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          icon={BookOpen}
          label="Admin"
          title="Articles management"
          description="Create categories, topics, and articles for Notes. Review editor submissions from the Reviews page."
        />
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/assignments"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
          >
            <UserPen className="size-4" />
            Assign writers
          </Link>
          <Link href="/admin/reviews" className={cn(buttonVariants({ variant: "outline" }), "w-fit")}>
            <ClipboardCheck className="size-4" />
            Open reviews
          </Link>
        </div>
      </div>

      {stats && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Categories", stats.categories],
            ["Topics", stats.topics],
            ["Pending review", stats.pendingReview],
            ["Published", stats.published],
            ["Edit requests", stats.editRequests],
          ].map(([label, value]) => (
            <div key={label} className="glass-panel p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </section>
      )}

      {loadError ? (
        <AdminLoadError error={loadError} />
      ) : (
        <AdminNotesPanel categories={categories} />
      )}
    </AppPage>
  );
}
