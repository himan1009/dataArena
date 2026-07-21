"use client";

import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Markdown } from "tiptap-markdown";

import { cn } from "@/lib/utils";

import { EditorToolbar } from "./editor-toolbar";

type RichTextEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your article here…",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4] },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "article-code-block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "article-editor-link",
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "article-editor-image",
        },
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: "article-editor-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList.configure({
        HTMLAttributes: {
          class: "article-task-list",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "article-task-item",
        },
      }),
      Placeholder.configure({ placeholder }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
        breaks: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "article-prose-editor",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: current }) => {
      const markdown = current.storage.markdown.getMarkdown();
      onChange(markdown);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.storage.markdown.getMarkdown();
    if (value !== current) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-white/[0.01]",
        className,
      )}
    >
      <div className="sticky top-0 z-10 shrink-0 border-b border-border bg-background/95 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-md">
        <EditorToolbar editor={editor} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <EditorContent editor={editor} />
      </div>

      <div className="shrink-0 border-t border-border/60 bg-white/[0.02] px-4 py-2 text-[11px] text-muted-foreground">
        <span className="hidden sm:inline">
          Shortcuts:{" "}
          <kbd className="rounded border border-border px-1">Ctrl+B</kbd> bold ·{" "}
          <kbd className="rounded border border-border px-1">Ctrl+I</kbd> italic ·{" "}
          <kbd className="rounded border border-border px-1">Ctrl+U</kbd> underline ·{" "}
          <kbd className="rounded border border-border px-1">Ctrl+Z</kbd> undo
        </span>
        <span className="sm:hidden">Tap toolbar buttons to format — no markdown needed.</span>
      </div>
    </div>
  );
}
