"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ApiError, notesApi } from "@/lib/notes-api";
import { cn } from "@/lib/utils";

type RequestEditPanelProps = {
  articleId: string;
  articleTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
};

export function RequestEditPanel({
  articleId,
  articleTitle,
  onSuccess,
  onCancel,
  className,
}: RequestEditPanelProps) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);

    if (!note.trim()) {
      setError("Please add a comment explaining why this article needs edits.");
      return;
    }

    setSubmitting(true);

    try {
      await notesApi.requestEditAccess(articleId, {
        note: note.trim(),
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send edit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("glass-panel space-y-5 p-5 sm:p-6", className)}>
      <div>
        <p className="section-label">Request edits</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">{articleTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell admin what needs to change. Admin will decide who should rewrite this article.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-note">Comment for admin *</Label>
        <textarea
          id="edit-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Example: The code examples are outdated and the conclusion section needs more detail."
          className="min-h-28 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={submit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Send edit request
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/[0.03]"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
