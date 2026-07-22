"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenCheck, ListChecks } from "lucide-react";

import { MarkdownContent } from "@/components/notes/markdown-content";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  WRITING_STANDARD_LABELS,
  type WritingStandard,
  type WritingStandardKey,
} from "@/lib/standards-api";
import { cn } from "@/lib/utils";

const TAB_ORDER: WritingStandardKey[] = ["MANDATORY", "ESSENTIAL"];

const TAB_ICONS = {
  MANDATORY: ListChecks,
  ESSENTIAL: BookOpenCheck,
} as const;

export function StandardsViewer({
  standards,
  editHref,
}: {
  standards: WritingStandard[];
  editHref?: string;
}) {
  const sortedStandards = useMemo(
    () =>
      TAB_ORDER.map((key) => standards.find((item) => item.key === key)).filter(
        (item): item is WritingStandard => Boolean(item),
      ),
    [standards],
  );

  const [activeKey, setActiveKey] = useState<WritingStandardKey>(
    sortedStandards[0]?.key ?? "MANDATORY",
  );

  const activeStandard =
    sortedStandards.find((item) => item.key === activeKey) ?? sortedStandards[0];

  if (!activeStandard) {
    return (
      <div className="glass-panel p-8 text-sm text-muted-foreground">
        Writing standards are not available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {sortedStandards.map((standard) => {
            const Icon = TAB_ICONS[standard.key];
            const isActive = standard.key === activeKey;

            return (
              <button
                key={standard.key}
                type="button"
                onClick={() => setActiveKey(standard.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/10 text-foreground"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {WRITING_STANDARD_LABELS[standard.key]}
              </button>
            );
          })}
        </div>

        {editHref && (
          <Link
            href={editHref}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "shrink-0 border-white/10 bg-white/[0.02]",
            )}
          >
            Edit standards
          </Link>
        )}
      </div>

      <div className="glass-panel p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-white/[0.06] pb-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {activeStandard.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated{" "}
              {new Date(activeStandard.updatedAt).toLocaleString()}
              {activeStandard.updatedByName
                ? ` by ${activeStandard.updatedByName}`
                : ""}
            </p>
          </div>
          {activeStandard.key === "MANDATORY" && (
            <Badge className="border-0 bg-gold-muted px-3 py-1 text-xs font-medium text-gold">
              Required before publish
            </Badge>
          )}
        </div>

        <MarkdownContent
          content={activeStandard.content}
          variant="standards"
          headingIds
        />
      </div>
    </div>
  );
}
