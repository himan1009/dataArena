import { redirect } from "next/navigation";
import { ClipboardCheck } from "lucide-react";

import { AdminReviewPanel } from "@/components/admin/admin-review-panel";
import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { requireUser } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";

export const metadata = {
  title: "Review queue",
};

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

  const response = await fetch(getBackendUrl("/notes/admin/review-queue"), {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  const data = response.ok ? await response.json() : { articles: [] };

  return (
    <div className="space-y-12 sm:space-y-14">
      <div className="flex items-start gap-5">
        <IconBox icon={ClipboardCheck} size="lg" className="hidden sm:flex" />
        <PageHeader
          label="Admin"
          title="Review queue"
          description="Approve, request changes, or reject author submissions before they go live."
        />
      </div>

      <AdminReviewPanel articles={data.articles ?? []} />
    </div>
  );
}
