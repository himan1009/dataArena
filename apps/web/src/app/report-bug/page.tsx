import { BugReportForm } from "@/components/feedback/bug-report-form";
import { SupportPageShell } from "@/components/feedback/support-page-shell";
import { PageIntro } from "@/components/ui/page-intro";
import { getCurrentUser } from "@/lib/auth-server";
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
        <PageIntro
          icon={Bug}
          label="Bug report"
          title="Report a problem"
          headingLevel={user ? "h2" : "h1"}
          description="Found something broken? Tell us which part of the app and what happened. We use this to fix issues faster."
        />

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
