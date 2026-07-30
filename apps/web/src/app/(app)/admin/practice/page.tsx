import Link from "next/link";
import { Code2, ClipboardCheck, Users } from "lucide-react";

import { AdminPracticePanel } from "@/components/practice/admin-practice-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-server";
import {
  getAdminPracticeCategories,
  getAdminPracticeStats,
} from "@/lib/practice-server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Practice CMS",
};

export default async function AdminPracticePage() {
  await requireAdmin();

  const [stats, categoriesData] = await Promise.all([
    getAdminPracticeStats(),
    getAdminPracticeCategories(),
  ]);

  return (
    <AppPage>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          icon={Code2}
          label="Admin"
          title="Practice management"
          description="Manage practice categories and topics. Review editor submissions from the Reviews page."
        />
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/users" className={cn(buttonVariants({ variant: "outline" }), "w-fit")}>
            <Users className="size-4" />
            Manage contributors
          </Link>
          <Link href="/admin/reviews" className={cn(buttonVariants({ variant: "outline" }), "w-fit")}>
            <ClipboardCheck className="size-4" />
            Open reviews
          </Link>
        </div>
      </div>

      <section className="glass-panel space-y-2 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Who can add questions?</p>
        <p>
          Only admins create categories and topics here. To let someone submit questions, go to{" "}
          <Link href="/admin/users" className="text-primary hover:underline">
            Admin → Users
          </Link>{" "}
          and click <strong className="text-foreground">Allow upload</strong> for that user. They
          will then see <strong className="text-foreground">Add question</strong> under Practice.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Categories", stats.categories],
          ["Topics", stats.topics],
          ["Pending review", stats.pendingReview],
          ["Published", stats.published],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <AdminPracticePanel categories={categoriesData.categories} />
    </AppPage>
  );
}
