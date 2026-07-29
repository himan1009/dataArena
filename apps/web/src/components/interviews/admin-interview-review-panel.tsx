"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, MessageSquare, X } from "lucide-react";

import { InterviewExperienceDetail } from "@/components/interviews/interview-experience-detail";
import { InterviewStatusBadge } from "@/components/interviews/interview-status-badge";
import { Button } from "@/components/ui/button";
import {
  InterviewApiError,
  interviewExperiencesApi,
  type InterviewExperience,
} from "@/lib/interview-experiences-api";

export function AdminInterviewReviewPanel({
  experiences,
}: {
  experiences: InterviewExperience[];
}) {
  const router = useRouter();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const review = async (
    id: string,
    action: "approve" | "reject" | "request_changes",
  ) => {
    setError(null);
    setLoadingId(id);
    try {
      await interviewExperiencesApi.adminReview(id, {
        action,
        comment: comments[id],
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof InterviewApiError ? err.message : "Review failed");
    } finally {
      setLoadingId(null);
    }
  };

  if (!experiences.length) {
    return (
      <div className="glass-panel p-6 text-sm text-muted-foreground">
        No interview experiences waiting for review.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {experiences.map((experience) => (
        <section key={experience.id} className="glass-panel space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{experience.title}</h3>
            <InterviewStatusBadge status={experience.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {experience.company} · {experience.role} ·{" "}
            {experience.author?.name || experience.author?.id}
          </p>

          <InterviewExperienceDetail experience={experience} />

          <textarea
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
            placeholder="Review note for the author (required for needs changes)..."
            value={comments[experience.id] ?? ""}
            onChange={(e) =>
              setComments((current) => ({
                ...current,
                [experience.id]: e.target.value,
              }))
            }
          />

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => review(experience.id, "approve")}
              disabled={loadingId === experience.id}
            >
              {loadingId === experience.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Approve & publish
            </Button>
            <Button
              variant="outline"
              onClick={() => review(experience.id, "request_changes")}
              disabled={loadingId === experience.id}
            >
              <MessageSquare className="size-4" />
              Needs changes
            </Button>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive"
              onClick={() => review(experience.id, "reject")}
              disabled={loadingId === experience.id}
            >
              <X className="size-4" />
              Reject
            </Button>
          </div>
        </section>
      ))}
    </div>
  );
}
