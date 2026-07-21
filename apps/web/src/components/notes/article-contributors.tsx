import Link from "next/link";
import { ExternalLink, PencilLine, User } from "lucide-react";

import type { AuthorSummary } from "@/lib/notes-api";

function ContributorCard({
  label,
  name,
  subtitle,
  linkedinUrl,
  icon: Icon,
}: {
  label: string;
  name: string;
  subtitle?: string | null;
  linkedinUrl?: string | null;
  icon: typeof User;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-white/[0.02]">
          <Icon className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </p>
          <p className="font-medium">{name}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {linkedinUrl && (
        <Link
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-white/[0.03]"
        >
          <ExternalLink className="size-4" />
          LinkedIn
        </Link>
      )}
    </div>
  );
}

export function ArticleContributors({
  author,
  publishedAt,
  lastEditor,
  editorEditedAt,
  lastEditorNameSnapshot,
}: {
  author: AuthorSummary | null | undefined;
  publishedAt?: string | null;
  lastEditor?: AuthorSummary | null;
  editorEditedAt?: string | null;
  lastEditorNameSnapshot?: string | null;
}) {
  if (!author) {
    return null;
  }

  const authorName = author.name || author.email.split("@")[0];
  const editorName =
    lastEditor?.name ||
    lastEditorNameSnapshot ||
    (lastEditor?.email ? lastEditor.email.split("@")[0] : null);

  const showEditorCredit = Boolean(editorEditedAt && editorName && editorName !== authorName);

  return (
    <section className="glass-panel space-y-6 p-6">
      <ContributorCard
        label="Written by"
        name={authorName}
        subtitle={
          publishedAt
            ? `Originally published ${new Date(publishedAt).toLocaleDateString()}`
            : undefined
        }
        linkedinUrl={author.linkedinUrl}
        icon={User}
      />

      {showEditorCredit && editorName && (
        <div className="border-t border-border pt-6">
          <ContributorCard
            label="Edited by"
            name={editorName}
            subtitle={
              editorEditedAt
                ? `Last updated ${new Date(editorEditedAt).toLocaleDateString()}`
                : undefined
            }
            linkedinUrl={lastEditor?.linkedinUrl}
            icon={PencilLine}
          />
        </div>
      )}
    </section>
  );
}
