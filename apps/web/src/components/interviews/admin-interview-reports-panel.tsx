"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Archive, ExternalLink, Flag, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InterviewApiError,
  interviewExperiencesApi,
  reportReasonLabels,
  type FeedbackStatus,
  type InterviewExperienceReport,
} from "@/lib/interview-experiences-api";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: FeedbackStatus }) {
  const styles =
    status === "NEW"
      ? "bg-amber-500/12 text-amber-200"
      : status === "READ"
        ? "bg-primary/12 text-primary"
        : "bg-white/[0.06] text-muted-foreground";

  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", styles)}>
      {status}
    </span>
  );
}

export function AdminInterviewReportsPanel({
  reports,
}: {
  reports: InterviewExperienceReport[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "new">("new");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const newCount = reports.filter((report) => report.status === "NEW").length;

  const visibleReports = useMemo(() => {
    if (filter === "new") {
      return reports.filter((report) => report.status === "NEW");
    }
    return reports;
  }, [filter, reports]);

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    setLoadingId(id);
    setError(null);
    try {
      await interviewExperiencesApi.adminUpdateReportStatus(id, status);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof InterviewApiError
          ? err.message
          : "Could not update the report status.",
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={filter === "new" ? "default" : "outline"}
          className={filter !== "new" ? "border-white/10 bg-white/[0.03]" : undefined}
          onClick={() => setFilter("new")}
        >
          <Flag className="size-4" />
          New reports
          {newCount > 0 && (
            <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 text-xs">
              {newCount}
            </span>
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          className={filter !== "all" ? "border-white/10 bg-white/[0.03]" : undefined}
          onClick={() => setFilter("all")}
        >
          All reports
        </Button>
      </div>

      {visibleReports.length === 0 ? (
        <div className="glass-panel p-6 text-sm text-muted-foreground">
          {filter === "new"
            ? "No new interview reports."
            : "No interview reports yet."}
        </div>
      ) : (
        visibleReports.map((report) => (
          <article key={report.id} className="glass-panel space-y-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{report.experience.title}</h3>
                  <StatusBadge status={report.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {report.experience.company} · {report.experience.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  Reported {new Date(report.createdAt).toLocaleString()}
                  {report.reporter
                    ? ` · ${report.reporter.name || report.reporter.email}`
                    : " · Anonymous"}
                </p>
              </div>
              <Link
                href={`/interviews/${report.experience.slug}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                View experience
                <ExternalLink className="size-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm">
              <p className="font-medium text-foreground">
                {reportReasonLabels[report.reason]}
              </p>
              {report.details && (
                <p className="mt-2 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {report.details}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {report.status === "NEW" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10"
                  disabled={loadingId === report.id}
                  onClick={() => updateStatus(report.id, "READ")}
                >
                  {loadingId === report.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Mark as read
                </Button>
              )}
              {report.status !== "ARCHIVED" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10"
                  disabled={loadingId === report.id}
                  onClick={() => updateStatus(report.id, "ARCHIVED")}
                >
                  <Archive className="size-4" />
                  Archive
                </Button>
              )}
            </div>
          </article>
        ))
      )}
    </div>
  );
}
