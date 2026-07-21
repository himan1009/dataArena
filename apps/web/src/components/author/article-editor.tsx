"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Loader2, PencilLine, Send, Sparkles } from "lucide-react";

import { MarkdownContent } from "@/components/notes/markdown-content";
import { ArticleStatusBadge } from "@/components/notes/article-status-badge";
import { RequestEditPanel } from "@/components/author/request-edit-panel";
import { RichTextEditor } from "@/components/author/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, notesApi, type ArticleStatus, type AuthorSummary } from "@/lib/notes-api";
import { slugify } from "@/lib/notes-utils";

function getWordStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readingMin = Math.max(1, Math.ceil(words / 200));
  return { words, chars, readingMin };
}

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
    editRequestedAt: string | null;
    editRequestNote: string | null;
    editAssignee: AuthorSummary | null;
    canEdit?: boolean;
    isAssignedToMe?: boolean;
    topic: {
      name: string;
      category: { name: string };
    };
  };
}) {
  const router = useRouter();
  const canEdit =
    article.canEdit ??
    (article.status === "DRAFT" || article.status === "CHANGES_REQUESTED");
  const canRequestEdit =
    (article.status === "SUBMITTED" || article.status === "PUBLISHED") &&
    !article.editRequestedAt &&
    !article.isAssignedToMe;
  const editPending = Boolean(article.editRequestedAt);
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [content, setContent] = useState(article.content);
  const [showMeta, setShowMeta] = useState(false);
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = useMemo(() => getWordStats(content), [content]);

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

  const statusMessage = article.isAssignedToMe
    ? "Assigned to you for rewriting — edit and submit when ready."
    : article.status === "SUBMITTED"
      ? "Submitted for review — read-only until admin responds."
      : article.status === "PUBLISHED"
        ? "Published — request edits and admin will assign who should rewrite."
        : "Read-only preview";

  return (
    <div
      className={
        canEdit
          ? "flex h-[calc(100dvh-6.5rem)] flex-col overflow-hidden sm:h-[calc(100dvh-7rem)]"
          : "flex min-h-[calc(100dvh-10rem)] flex-col"
      }
    >
      <div className="sticky top-0 z-30 -mx-4 shrink-0 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Link
              href="/write"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <ArticleStatusBadge status={article.status} />
            {article.isAssignedToMe && (
              <span className="rounded-full bg-teal/15 px-2.5 py-0.5 text-xs font-medium text-teal">
                Assigned to you
              </span>
            )}
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {article.topic.category.name} · {article.topic.name}
            </span>
          </div>

          {canEdit && (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={saveDraft} disabled={isSaving || isSubmitting}>
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                size="sm"
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
                    Submit
                  </>
                )}
              </Button>
            </div>
          )}

          {canRequestEdit && !showRequestPanel && (
            <Button size="sm" onClick={() => setShowRequestPanel(true)}>
              <PencilLine className="size-4" />
              Request edits
            </Button>
          )}
        </div>
      </div>

      {editPending && (
        <div className="mb-3 shrink-0 rounded-xl border border-violet/30 bg-violet/10 px-4 py-3 text-sm text-violet">
          <strong>Edit request pending.</strong> Admin will review your comment and assign an editor.
          {article.editRequestNote && (
            <span className="mt-1 block text-muted-foreground">
              Your comment: {article.editRequestNote}
            </span>
          )}
        </div>
      )}
      {article.reviewComment && (
        <div className="mb-3 shrink-0 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          <strong>Admin feedback:</strong> {article.reviewComment}
        </div>
      )}
      {message && (
        <div className="mb-3 shrink-0 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-3 shrink-0 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showRequestPanel && canRequestEdit && (
        <RequestEditPanel
          articleId={article.id}
          articleTitle={article.title}
          className="mb-4 shrink-0"
          onCancel={() => setShowRequestPanel(false)}
          onSuccess={() => {
            setShowRequestPanel(false);
            setMessage("Edit request sent to admin.");
            router.refresh();
          }}
        />
      )}

      {!canEdit ? (
        <div className="w-full space-y-6">
          <div className="border-b border-border pb-6">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{statusMessage}</p>
          </div>
          <MarkdownContent content={content} variant="reading" />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="mb-3 shrink-0 space-y-3">
            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slug || slug === slugify(title)) {
                  setSlug(slugify(event.target.value));
                }
              }}
              placeholder="Article title"
              className="w-full border-0 bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/40 sm:text-3xl"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMeta((current) => !current)}
                  className="text-primary hover:underline"
                >
                  {showMeta ? "Hide slug" : "Edit slug"}
                </button>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground/80">
                  <Sparkles className="size-3.5 text-gold" />
                  Write like Google Docs — headings, lists, tables, images, code & more from the toolbar
                </span>
              </div>
              <span>
                {stats.words} words · {stats.chars} chars · ~{stats.readingMin} min read
              </span>
            </div>
            {showMeta && (
              <div className="max-w-md space-y-2">
                <Label htmlFor="slug" className="text-xs">
                  URL slug
                </Label>
                <Input
                  id="slug"
                  className="surface-input h-9 text-sm"
                  value={slug}
                  onChange={(event) => setSlug(slugify(event.target.value))}
                />
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Start writing your article here. Pick a heading style, add bullet points, paste code snippets — no markdown syntax needed."
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
