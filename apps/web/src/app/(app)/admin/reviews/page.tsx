import { redirect } from "next/navigation";
import { ClipboardCheck } from "lucide-react";

import { AdminEditRequestsPanel } from "@/components/admin/admin-edit-requests-panel";
import { AdminReviewPanel } from "@/components/admin/admin-review-panel";
import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { requireUser } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";

export const metadata = {
  title: "Review queue",
};

async function fetchAdminJson(path: string, cookieHeader: string) {
  const response = await fetch(getBackendUrl(path), {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  return response.ok ? response.json() : null;
}

export default async function AdminReviewsPage() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const cookieStore = await import("next/headers").then((mod) => mod.cookies());
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const [reviewData, editRequestData] = await Promise.all([
    fetchAdminJson("/notes/admin/review-queue", cookieHeader),
    fetchAdminJson("/notes/admin/edit-requests", cookieHeader),
  ]);

  return (
    <div className="space-y-12 sm:space-y-14">
      <div className="flex items-start gap-5">
        <IconBox icon={ClipboardCheck} size="lg" className="hidden sm:flex" />
        <PageHeader
          label="Admin"
          title="Review queue"
          description="Approve submissions, grant edit access when authors request changes, and manage the publishing workflow."
        />
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Edit access requests</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Authors raise edit requests with a comment. Approve, assign who should rewrite, or reject
            with feedback.
          </p>
        </div>
        <AdminEditRequestsPanel articles={editRequestData?.articles ?? []} />
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">New submissions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review articles waiting to be published for the first time or after revisions.
          </p>
        </div>
        <AdminReviewPanel articles={reviewData?.articles ?? []} />
      </section>
    </div>
  );
}
