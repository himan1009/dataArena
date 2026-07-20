"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, MessageSquare, X } from "lucide-react";

import { MarkdownContent } from "@/components/notes/markdown-content";
import { ArticleStatusBadge } from "@/components/notes/article-status-badge";
import { Button } from "@/components/ui/button";
import { ApiError, notesApi, type ReviewArticle } from "@/lib/notes-api";

export function AdminReviewPanel({ articles }: { articles: ReviewArticle[] }) {
  const router = useRouter();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const review = async (
    articleId: string,
    action: "approve" | "reject" | "request_changes",
  ) => {
    setError(null);
    setLoadingId(articleId);

    try {
      await notesApi.reviewArticle(articleId, {
        action,
        comment: comments[articleId],
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Review action failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {articles.map((article) => (
        <section key={article.id} className="glass-panel space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <ArticleStatusBadge status={article.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {article.topic.category.name} · {article.topic.name}
              </p>
              {article.author && (
                <p className="mt-2 text-sm">
                  By <strong>{article.author.name || article.author.email}</strong>
                  {article.author.linkedinUrl && (
                    <span className="text-muted-foreground"> · LinkedIn on file</span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <MarkdownContent content={article.content} />
          </div>

          <textarea
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
            placeholder="Add review comments for the author..."
            value={comments[article.id] ?? ""}
            onChange={(event) =>
              setComments((current) => ({
                ...current,
                [article.id]: event.target.value,
              }))
            }
          />

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => review(article.id, "approve")}
              disabled={loadingId === article.id}
            >
              {loadingId === article.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Approve & publish
            </Button>
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03]"
              onClick={() => review(article.id, "request_changes")}
              disabled={loadingId === article.id}
            >
              <MessageSquare className="size-4" />
              Request changes
            </Button>
            <Button
              variant="destructive"
              onClick={() => review(article.id, "reject")}
              disabled={loadingId === article.id}
            >
              <X className="size-4" />
              Reject
            </Button>
          </div>
        </section>
      ))}

      {articles.length === 0 && (
        <div className="glass-panel p-8 text-center text-sm text-muted-foreground">
          No articles waiting for review.
        </div>
      )}
    </div>
  );
}
