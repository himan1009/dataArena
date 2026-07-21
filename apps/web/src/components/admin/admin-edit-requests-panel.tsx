"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

import { ArticleStatusBadge } from "@/components/notes/article-status-badge";
import { MarkdownContent } from "@/components/notes/markdown-content";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ApiError,
  notesApi,
  type AuthorSummary,
  type EditRequestArticle,
} from "@/lib/notes-api";

export function AdminEditRequestsPanel({
  articles,
}: {
  articles: EditRequestArticle[];
}) {
  const router = useRouter();
  const [editors, setEditors] = useState<AuthorSummary[]>([]);
  const [assignees, setAssignees] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    notesApi
      .getAdminEditors()
      .then((response) => {
        if (!active) return;
        setEditors(response.editors);
      })
      .catch(() => {
        if (active) setError("Could not load editors for assignment");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setAssignees((current) => {
      const next = { ...current };
      for (const article of articles) {
        if (!next[article.id]) {
          next[article.id] = article.author?.id ?? editors[0]?.id ?? "";
        }
      }
      return next;
    });
  }, [articles, editors]);

  const review = async (articleId: string, action: "approve" | "reject") => {
    setError(null);
    setLoadingId(articleId);

    try {
      if (action === "approve" && !assignees[articleId]) {
        throw new ApiError("Please select who should edit this article", 400);
      }

      await notesApi.reviewEditRequest(articleId, {
        action,
        comment: comments[articleId],
        assigneeId: action === "approve" ? assignees[articleId] : undefined,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Edit request action failed");
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
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <ArticleStatusBadge status={article.status} />
                <span className="rounded-full bg-violet/15 px-2.5 py-0.5 text-xs font-medium text-violet">
                  Edit requested
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {article.topic.category.name} · {article.topic.name}
              </p>
              {article.author && (
                <p className="mt-2 text-sm">
                  Original author{" "}
                  <strong>{article.author.name || article.author.email}</strong>
                </p>
              )}
              {article.editRequestedBy && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Requested by{" "}
                  <strong className="text-foreground">
                    {article.editRequestedBy.name || article.editRequestedBy.email}
                  </strong>
                </p>
              )}
              {article.editRequestNote && (
                <p className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-muted-foreground">
                  <strong className="text-foreground">Author comment:</strong>{" "}
                  {article.editRequestNote}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <MarkdownContent content={article.content} variant="embedded" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`assignee-${article.id}`}>Assign editor to rewrite *</Label>
              <select
                id={`assignee-${article.id}`}
                value={assignees[article.id] ?? ""}
                onChange={(event) =>
                  setAssignees((current) => ({
                    ...current,
                    [article.id]: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-lg border border-border bg-white/[0.03] px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              >
                {editors.map((editor) => (
                  <option key={editor.id} value={editor.id}>
                    {editor.name || editor.email}
                    {editor.id === article.author?.id ? " (original author)" : ""}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Choose the same author or assign a different editor.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`comment-${article.id}`}>Admin comment</Label>
              <textarea
                id={`comment-${article.id}`}
                className="min-h-24 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
                placeholder="Optional message to the assigned editor..."
                value={comments[article.id] ?? ""}
                onChange={(event) =>
                  setComments((current) => ({
                    ...current,
                    [article.id]: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => review(article.id, "approve")}
              disabled={loadingId === article.id || editors.length === 0}
            >
              {loadingId === article.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Approve & assign editor
            </Button>
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03]"
              onClick={() => review(article.id, "reject")}
              disabled={loadingId === article.id}
            >
              <X className="size-4" />
              Reject with comment
            </Button>
          </div>
        </section>
      ))}

      {articles.length === 0 && (
        <div className="glass-panel p-8 text-center text-sm text-muted-foreground">
          No edit access requests right now.
        </div>
      )}
    </div>
  );
}
