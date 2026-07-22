import { ClipboardCheck } from "lucide-react";

import { AdminEditRequestsPanel } from "@/components/admin/admin-edit-requests-panel";
import { AdminReviewPanel } from "@/components/admin/admin-review-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { requireAdmin } from "@/lib/auth-server";
import { fetchAdminData } from "@/lib/fetch-server";
import type { EditRequestArticle, ReviewArticle } from "@/lib/notes-api";

export const metadata = {
  title: "Reviews",
};

export default async function AdminReviewsPage() {
  await requireAdmin();

  const [reviewData, editRequestData] = await Promise.all([
    fetchAdminData<{ articles: ReviewArticle[] }>("/notes/admin/review-queue"),
    fetchAdminData<{ articles: EditRequestArticle[] }>("/notes/admin/edit-requests"),
  ]);

  return (
    <AppPage>
      <PageIntro
        icon={ClipboardCheck}
        label="Admin"
        title="Reviews"
        description="Approve submissions, grant edit access when authors request changes, and manage the publishing workflow."
      />

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Edit access requests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Authors requesting permission to edit published articles.
          </p>
        </div>
        <AdminEditRequestsPanel articles={editRequestData?.articles ?? []} />
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Submission queue</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New articles waiting for admin review and publication.
          </p>
        </div>
        <AdminReviewPanel articles={reviewData?.articles ?? []} />
      </section>
    </AppPage>
  );
}
