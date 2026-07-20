"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

import { MarkdownContent } from "@/components/notes/markdown-content";
import { ArticleStatusBadge } from "@/components/notes/article-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, notesApi, type ArticleStatus } from "@/lib/notes-api";
import { slugify } from "@/lib/notes-utils";

export function ArticleEditor({
  article,
}: {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: ArticleStatus;
    reviewComment: string | null;
    topic: {
      name: string;
      category: { name: string };
    };
  };
}) {
  const router = useRouter();
  const canEdit = article.status === "DRAFT" || article.status === "CHANGES_REQUESTED";
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [content, setContent] = useState(article.content);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveDraft = async () => {
    setMessage(null);
    setError(null);
    setIsSaving(true);

    try {
      await notesApi.updateArticle(article.id, {
        title,
        slug: slug || slugify(title),
        content,
      });
      setMessage("Draft saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const submitForReview = async () => {
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await notesApi.updateArticle(article.id, {
        title,
        slug: slug || slugify(title),
        content,
      });
      await notesApi.submitArticle(article.id);
      setMessage("Submitted for admin review.");
      router.push("/write");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <ArticleStatusBadge status={article.status} />
        <p className="text-sm text-muted-foreground">
          {article.topic.category.name} · {article.topic.name}
        </p>
      </div>

      {article.reviewComment && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          <strong>Admin feedback:</strong> {article.reviewComment}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!canEdit ? (
        <div className="glass-panel p-6 text-sm text-muted-foreground">
          This article can no longer be edited. Published and submitted articles are locked for authors.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                className="surface-input"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (!slug || slug === slugify(title)) {
                    setSlug(slugify(event.target.value));
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                className="surface-input"
                value={slug}
                onChange={(event) => setSlug(slugify(event.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content">Markdown</Label>
              <textarea
                id="content"
                className="min-h-[28rem] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="glass-panel min-h-[28rem] overflow-auto p-5">
                <MarkdownContent content={content} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={saveDraft} disabled={isSaving || isSubmitting}>
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save draft"
              )}
            </Button>
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03]"
              onClick={submitForReview}
              disabled={isSaving || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Submit for review
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
