import { ExternalLink } from "lucide-react";

import { CompanyTagList } from "@/components/practice/company-tag-input";
import { Badge } from "@/components/ui/badge";
import {
  difficultyLabels,
  platformLabels,
  type PracticeDifficulty,
  type PracticeQuestion,
} from "@/lib/practice-api";

const difficultyStyles: Record<PracticeDifficulty, string> = {
  EASY: "bg-emerald-500/15 text-emerald-300",
  MEDIUM: "bg-amber-500/15 text-amber-300",
  HARD: "bg-rose-500/15 text-rose-300",
};

export function PracticeQuestionRow({
  question,
  index,
}: {
  question: PracticeQuestion;
  index: number;
}) {
  return (
    <div className="glass-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-xs font-semibold text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold tracking-tight">{question.title}</h3>
            <Badge className={difficultyStyles[question.difficulty]}>
              {difficultyLabels[question.difficulty]}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{platformLabels[question.platform]}</span>
            {question.estimatedTime && (
              <>
                <span>·</span>
                <span>{question.estimatedTime}</span>
              </>
            )}
          </div>
          {question.companyTags.length > 0 && (
            <div className="mt-3">
              <CompanyTagList tags={question.companyTags} />
            </div>
          )}
        </div>
      </div>
      <a
        href={question.questionUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-white/[0.06]"
      >
        Solve on {platformLabels[question.platform]}
        <ExternalLink className="size-4" />
      </a>
    </div>
  );
}
