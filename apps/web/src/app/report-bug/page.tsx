import { getCurrentUser } from "@/lib/auth-server";
import { BugReportForm } from "@/components/feedback/bug-report-form";
import { SupportPageShell } from "@/components/feedback/support-page-shell";
import { Bug } from "lucide-react";

export const metadata = {
  title: "Report a bug",
  description: "Report a problem on DataArena.",
};

export default async function ReportBugPage() {
  const user = await getCurrentUser();

  return (
    <SupportPageShell user={user}>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-white/[0.03]">
            <Bug className="size-5 text-primary" />
          </div>
          <div>
            <p className="section-label">Bug report</p>
            <h1 className="text-3xl font-semibold tracking-tight">Report a problem</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Found something broken? Tell us which part of the app and what happened.
              We use this to fix issues faster.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8">
          <BugReportForm
            defaultName={user?.name ?? ""}
            defaultEmail={user?.email ?? ""}
          />
        </div>
      </div>
    </SupportPageShell>
  );
}
