import { ClipboardCheck } from "lucide-react";

import { AdminEditRequestsPanel } from "@/components/admin/admin-edit-requests-panel";
import { AdminReviewPanel } from "@/components/admin/admin-review-panel";
import { AdminInterviewReviewPanel } from "@/components/interviews/admin-interview-review-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { requireAdmin } from "@/lib/auth-server";
import { fetchAdminData } from "@/lib/fetch-server";
import {
  getAdminInterviewReviewQueue,
  getAdminInterviewStats,
} from "@/lib/interviews-server";
import type { EditRequestArticle, ReviewArticle } from "@/lib/notes-api";

export const metadata = {
  title: "Reviews",
};

export default async function AdminReviewsPage() {
  await requireAdmin();

  const [reviewData, editRequestData, interviewStats, interviewQueue] =
    await Promise.all([
      fetchAdminData<{ articles: ReviewArticle[] }>("/notes/admin/review-queue"),
      fetchAdminData<{ articles: EditRequestArticle[] }>("/notes/admin/edit-requests"),
      getAdminInterviewStats(),
      getAdminInterviewReviewQueue(),
    ]);

  const pendingInterviewCount = interviewQueue.experiences.length;
  const pendingArticleCount = reviewData?.articles?.length ?? 0;
  const pendingEditRequestCount = editRequestData?.articles?.length ?? 0;
  const totalPending =
    pendingInterviewCount + pendingArticleCount + pendingEditRequestCount;

  return (
    <AppPage>
      <PageIntro
        icon={ClipboardCheck}
        label="Admin"
        title="Reviews"
        description="One place for all pending reviews — interview experiences, article submissions, and edit access requests."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total pending", totalPending],
          ["Interview experiences", pendingInterviewCount],
          ["Article submissions", pendingArticleCount],
          ["Edit access requests", pendingEditRequestCount],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Interview experiences
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Community interview stories waiting for approval before publishing.
            Published: {interviewStats.published} · Needs changes:{" "}
            {interviewStats.needsChanges} · Rejected: {interviewStats.rejected}
          </p>
        </div>
        <AdminInterviewReviewPanel experiences={interviewQueue.experiences} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Edit access requests
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Authors requesting permission to edit published articles.
          </p>
        </div>
        <AdminEditRequestsPanel articles={editRequestData?.articles ?? []} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Article submissions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New articles waiting for admin review and publication.
          </p>
        </div>
        <AdminReviewPanel articles={reviewData?.articles ?? []} />
      </section>
    </AppPage>
  );
}
