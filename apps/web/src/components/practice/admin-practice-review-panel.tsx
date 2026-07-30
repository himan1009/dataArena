"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { PracticeQuestionCard } from "@/components/practice/practice-question-card";
import { Button } from "@/components/ui/button";
import {
  PracticeApiError,
  practiceApi,
  type PracticeQuestion,
} from "@/lib/practice-api";

export function AdminPracticeReviewPanel({
  questions,
}: {
  questions: PracticeQuestion[];
}) {
  const router = useRouter();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const review = async (id: string, action: "approve" | "reject") => {
    setError(null);
    setLoadingId(id);
    try {
      await practiceApi.adminReview(id, {
        action,
        comment: comments[id],
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof PracticeApiError ? err.message : "Review failed");
    } finally {
      setLoadingId(null);
    }
  };

  if (!questions.length) {
    return (
      <div className="glass-panel p-6 text-sm text-muted-foreground">
        No practice questions waiting for review.
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

      {questions.map((question) => (
        <section key={question.id} className="space-y-4">
          <PracticeQuestionCard question={question} showStatus />
          <p className="text-sm text-muted-foreground">
            Submitted by {question.authorNameSnapshot || "Unknown author"}
            {question.submittedAt
              ? ` · ${new Date(question.submittedAt).toLocaleDateString()}`
              : ""}
          </p>
          <textarea
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
            placeholder="Review note for the author (optional for approval)..."
            value={comments[question.id] ?? ""}
            onChange={(event) =>
              setComments((current) => ({
                ...current,
                [question.id]: event.target.value,
              }))
            }
          />
          <div className="flex flex-wrap gap-3">
            <Button
              disabled={loadingId === question.id}
              onClick={() => void review(question.id, "approve")}
            >
              {loadingId === question.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Approve & publish
            </Button>
            <Button
              variant="destructive"
              disabled={loadingId === question.id}
              onClick={() => void review(question.id, "reject")}
            >
              {loadingId === question.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
              Reject
            </Button>
          </div>
        </section>
      ))}
    </div>
  );
}
