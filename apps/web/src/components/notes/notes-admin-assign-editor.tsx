"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ApiError, notesApi, type AuthorSummary } from "@/lib/notes-api";

export function NotesAdminAssignEditor({
  articleId,
  articleTitle,
  topicHref,
}: {
  articleId: string;
  articleTitle: string;
  topicHref: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editors, setEditors] = useState<AuthorSummary[]>([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingEditors, setLoadingEditors] = useState(false);

  useEffect(() => {
    if (!open || editors.length > 0) {
      return;
    }

    let active = true;
    setLoadingEditors(true);

    notesApi
      .getAdminEditors()
      .then((response) => {
        if (!active) return;
        setEditors(response.editors);
        setAssigneeId(response.editors[0]?.id ?? "");
      })
      .catch(() => {
        if (active) setError("Could not load team editors");
      })
      .finally(() => {
        if (active) setLoadingEditors(false);
      });

    return () => {
      active = false;
    };
  }, [open, editors.length]);

  const assign = async () => {
    if (!assigneeId) {
      setError("Please select a team member");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await notesApi.assignEditor(articleId, {
        assigneeId,
        comment: comment.trim() || undefined,
      });
      const message =
        (response as { message?: string }).message ??
        "Edit access granted successfully.";
      setOpen(false);
      setComment("");
      setSuccess(message);
      router.push(`${topicHref}?editorAssigned=1`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to assign editor");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <div className="flex flex-col items-end gap-2">
        {success && (
          <p className="flex items-center gap-1.5 text-xs text-teal">
            <CheckCircle2 className="size-3.5" />
            {success}
          </p>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="shrink-0 border-white/10 bg-white/[0.03]"
          onClick={() => {
            setOpen(true);
            setError(null);
          }}
        >
          <UserPlus className="size-4" />
          Assign editor
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4 rounded-xl border border-white/[0.08] bg-card/95 p-4 shadow-lg">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-gold">
          Assign editor
        </p>
        <p className="mt-1 text-sm font-medium">{articleTitle}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Grant a team editor access to rewrite this article. The article stays
          published until they submit changes for your review.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`assign-editor-${articleId}`}>Team member</Label>
        <select
          id={`assign-editor-${articleId}`}
          value={assigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
          disabled={loadingEditors}
          className="h-10 w-full rounded-lg border border-border bg-white/[0.03] px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        >
          {editors.map((editor) => (
            <option key={editor.id} value={editor.id}>
              {editor.name || editor.email}
              {editor.role === "ADMIN" ? " (admin)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`assign-comment-${articleId}`}>Note for editor</Label>
        <textarea
          id={`assign-comment-${articleId}`}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="What should they update?"
          className="min-h-20 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={assign} disabled={loading || loadingEditors}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" />
          )}
          Grant edit access
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
