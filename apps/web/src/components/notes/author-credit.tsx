import Link from "next/link";
import { ExternalLink, User } from "lucide-react";

import type { AuthorSummary } from "@/lib/notes-api";

export function AuthorCredit({
  author,
  publishedAt,
}: {
  author: AuthorSummary | null | undefined;
  publishedAt?: string | null;
}) {
  if (!author) {
    return null;
  }

  return (
    <section className="glass-panel mt-8 p-6">
      <p className="section-label mb-3">Author</p>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-white/[0.02]">
            <User className="size-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              {author.name || author.email.split("@")[0]}
            </p>
            {publishedAt && (
              <p className="text-sm text-muted-foreground">
                Published {new Date(publishedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {author.linkedinUrl && (
          <Link
            href={author.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-white/[0.03]"
          >
            <ExternalLink className="size-4" />
            LinkedIn
          </Link>
        )}
      </div>
    </section>
  );
}
