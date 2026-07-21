"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, Sparkles, Trash2 } from "lucide-react";

import { RichTextEditor } from "@/components/author/rich-text-editor";
import { AdminEditedBadge } from "@/components/notes/admin-edited-badge";
import { ArticleStatusBadge } from "@/components/notes/article-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, notesApi, type ArticleStatus } from "@/lib/notes-api";
import { slugify } from "@/lib/notes-utils";

function getWordStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readingMin = Math.max(1, Math.ceil(words / 200));
  return { words, chars, readingMin };
}

export function AdminArticleEditor({
  article,
}: {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: ArticleStatus;
    adminEditedAt?: string | null;
    topic: {
      name: string;
      slug: string;
      category: { name: string; slug: string };
    };
  };
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(article.slug);
  const readerHref = `/notes/${article.topic.category.slug}/${article.topic.slug}/${slug}`;
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [adminEditedAt, setAdminEditedAt] = useState(article.adminEditedAt ?? null);
  const [showMeta, setShowMeta] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const stats = useMemo(() => getWordStats(content), [content]);

  const saveArticle = async () => {
    setMessage(null);
    setError(null);
    setIsSaving(true);

    try {
      const nextSlug = slug || slugify(title);
      const response = await notesApi.updateArticleAdmin(article.id, {
        title,
        slug: nextSlug,
        content,
        published: article.status === "PUBLISHED" ? true : undefined,
      });
      const updated = response as { adminEditedAt?: string | null; slug?: string };
      if (updated.adminEditedAt) {
        setAdminEditedAt(updated.adminEditedAt);
      } else {
        setAdminEditedAt(new Date().toISOString());
      }
      if (updated.slug) {
        setSlug(updated.slug);
      } else {
        setSlug(nextSlug);
      }
      setMessage("Article saved. Marked as admin edited.");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteArticle = async () => {
    if (
      !window.confirm(
        `Delete "${title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await notesApi.deleteArticleAdmin(article.id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-6.5rem)] flex-col overflow-hidden sm:h-[calc(100dvh-7rem)]">
      <div className="sticky top-0 z-30 -mx-4 shrink-0 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Link
              href={readerHref}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to article
            </Link>
            <ArticleStatusBadge status={article.status} />
            <AdminEditedBadge adminEditedAt={adminEditedAt} />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {article.topic.category.name} · {article.topic.name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href={readerHref} target="_blank">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/[0.03]">
                <ExternalLink className="size-4" />
                View live
              </Button>
            </Link>
            <Button size="sm" onClick={saveArticle} disabled={isSaving || isDeleting}>
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
            {article.status === "DRAFT" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteArticle}
                disabled={isSaving || isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Delete draft
              </Button>
            )}
          </div>
        </div>
      </div>

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
              <span className="inline-flex items-center gap-1.5 text-gold">
                <Sparkles className="size-3.5" />
                Admin editor — changes save directly to Notes
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
            placeholder="Edit article content..."
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
