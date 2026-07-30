import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  difficultyLabels,
  platformLabels,
  questionStatusLabels,
  type PracticeDifficulty,
  type PracticeQuestion,
  type PracticeQuestionStatus,
} from "@/lib/practice-api";

const difficultyStyles: Record<PracticeDifficulty, string> = {
  EASY: "bg-emerald-500/15 text-emerald-300",
  MEDIUM: "bg-amber-500/15 text-amber-300",
  HARD: "bg-rose-500/15 text-rose-300",
};

export function PracticeQuestionCard({
  question,
  showStatus = false,
}: {
  question: PracticeQuestion;
  showStatus?: boolean;
}) {
  const status = question.status as PracticeQuestionStatus | undefined;

  return (
    <article className="glass-panel flex flex-col gap-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
            {question.category.name} · {question.topic.name}
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{question.title}</h3>
        </div>
        <Badge className={difficultyStyles[question.difficulty]}>
          {difficultyLabels[question.difficulty]}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>{platformLabels[question.platform]}</span>
        {question.estimatedTime && (
          <>
            <span>·</span>
            <span>{question.estimatedTime}</span>
          </>
        )}
        {question.companyTags.length > 0 && (
          <>
            <span>·</span>
            <span>{question.companyTags.join(", ")}</span>
          </>
        )}
      </div>

      {question.description && (
        <p className="line-clamp-2 text-sm leading-7 text-muted-foreground">
          {question.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3">
        <a
          href={question.questionUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Open on {platformLabels[question.platform]}
          <ExternalLink className="size-4" />
        </a>
        {showStatus && status && (
          <Badge className="bg-white/10 text-foreground">
            {questionStatusLabels[status]}
          </Badge>
        )}
      </div>
    </article>
  );
}
