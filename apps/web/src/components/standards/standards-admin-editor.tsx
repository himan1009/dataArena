"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";

import { MarkdownContent } from "@/components/notes/markdown-content";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  StandardsApiError,
  standardsApi,
  WRITING_STANDARD_LABELS,
  type WritingStandard,
  type WritingStandardKey,
} from "@/lib/standards-api";
import { cn } from "@/lib/utils";

const TAB_ORDER: WritingStandardKey[] = ["MANDATORY", "ESSENTIAL"];

type ScrollPane = "editor" | "preview";

function syncScrollPosition(source: HTMLElement, target: HTMLElement) {
  const sourceMax = source.scrollHeight - source.clientHeight;
  const targetMax = target.scrollHeight - target.clientHeight;

  if (sourceMax <= 0 || targetMax <= 0) {
    return;
  }

  const ratio = source.scrollTop / sourceMax;
  target.scrollTop = ratio * targetMax;
}

export function StandardsAdminEditor({
  initialStandards,
}: {
  initialStandards: WritingStandard[];
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const syncSourceRef = useRef<ScrollPane | null>(null);

  const [standards, setStandards] = useState(initialStandards);
  const [activeKey, setActiveKey] = useState<WritingStandardKey>("MANDATORY");
  const [title, setTitle] = useState(
    () => initialStandards.find((item) => item.key === "MANDATORY")?.title ?? "",
  );
  const [content, setContent] = useState(
    () =>
      initialStandards.find((item) => item.key === "MANDATORY")?.content ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEditorScroll = useCallback(() => {
    if (syncSourceRef.current === "preview") return;

    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    syncSourceRef.current = "editor";
    syncScrollPosition(editor, preview);
    syncSourceRef.current = null;
  }, []);

  const handlePreviewScroll = useCallback(() => {
    if (syncSourceRef.current === "editor") return;

    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    syncSourceRef.current = "preview";
    syncScrollPosition(preview, editor);
    syncSourceRef.current = null;
  }, []);

  const selectStandard = (key: WritingStandardKey) => {
    const standard = standards.find((item) => item.key === key);
    if (!standard) return;

    setActiveKey(key);
    setTitle(standard.title);
    setContent(standard.content);
    setError(null);
    setSuccess(null);

    requestAnimationFrame(() => {
      editorRef.current?.scrollTo({ top: 0 });
      previewRef.current?.scrollTo({ top: 0 });
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const startedAt = Date.now();

    try {
      const response = await standardsApi.update(activeKey, { title, content });
      setStandards((current) =>
        current.map((item) =>
          item.key === activeKey ? response.standard : item,
        ),
      );
      setSuccess(`${WRITING_STANDARD_LABELS[activeKey]} saved.`);
    } catch (err) {
      setError(
        err instanceof StandardsApiError
          ? err.message
          : "Could not save writing standards.",
      );
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 350) {
        await new Promise((resolve) => window.setTimeout(resolve, 350 - elapsed));
      }
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-white/[0.07] pb-3">
        <div className="flex flex-wrap gap-2">
          {TAB_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectStandard(key)}
              disabled={saving}
              className={cn(
                "rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-60",
                activeKey === key
                  ? "border-primary/30 bg-primary/10 text-foreground"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
              )}
            >
              {WRITING_STANDARD_LABELS[key]}
            </button>
          ))}
        </div>

        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          disabled={saving}
          placeholder="Document title"
          className="surface-input h-9 min-w-[12rem] flex-1 sm:max-w-xs"
        />

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Link
            href="/write/standards"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-white/10 bg-white/[0.02]",
            )}
          >
            View as editor
          </Link>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="shrink-0 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-teal/25 bg-teal/10 px-3 py-2 text-sm text-teal">
          <CheckCircle2 className="size-4" />
          {success}
        </div>
      )}

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2 lg:grid-rows-1">
        <section className="glass-panel flex min-h-0 min-w-0 flex-col overflow-hidden p-3 sm:p-4">
          <div className="relative min-h-0 flex-1">
            <textarea
              ref={editorRef}
              id="standard-content"
              aria-label="Markdown content"
              className="app-scrollbar absolute inset-0 h-full w-full resize-none overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 font-mono text-[13px] leading-7 outline-none transition-colors focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20 sm:text-sm"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onScroll={handleEditorScroll}
              spellCheck={false}
              disabled={saving}
              placeholder="Write markdown here..."
            />
          </div>
        </section>

        <section className="glass-panel flex min-h-0 min-w-0 flex-col overflow-hidden p-3 sm:p-4">
          <div className="relative min-h-0 flex-1">
            <div
              ref={previewRef}
              onScroll={handlePreviewScroll}
              className="app-scrollbar absolute inset-0 overflow-y-auto overscroll-contain px-1"
            >
              <MarkdownContent content={content} variant="standards" headingIds />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
