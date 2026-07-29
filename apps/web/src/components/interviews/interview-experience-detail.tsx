"use client";

import {
  difficultyLabels,
  levelLabels,
  resultLabels,
  roleLevelLabels,
  roundTypeLabels,
  type InterviewExperience,
} from "@/lib/interview-experiences-api";

function parseQuestionsAsked(questionsAsked: string): string[] {
  try {
    const parsed = JSON.parse(questionsAsked) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
        .map((item) =>
          typeof item === "string"
            ? item
            : typeof item === "object" && item && "text" in item
              ? String((item as { text?: string }).text ?? "")
              : "",
        )
        .filter(Boolean);
    }
  } catch {
    // Legacy plain-text questions
  }

  if (questionsAsked.trim()) {
    return [questionsAsked];
  }

  return [];
}

function QuestionsList({ questionsAsked }: { questionsAsked: string }) {
  const questions = parseQuestionsAsked(questionsAsked);

  if (questions.length === 0) {
    return <p className="text-sm text-muted-foreground">No questions listed.</p>;
  }

  return (
    <ol className="space-y-2">
      {questions.map((question, index) => (
        <li
          key={`${index}-${question.slice(0, 24)}`}
          className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm leading-6 text-muted-foreground"
        >
          <span className="font-medium text-foreground">Q{index + 1}.</span>{" "}
          {question}
        </li>
      ))}
    </ol>
  );
}

export function InterviewExperienceDetail({
  experience,
}: {
  experience: InterviewExperience;
}) {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {experience.company}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{experience.title}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{experience.role}</span>
          <span>·</span>
          <span>
            {experience.yearsOfExperience
              ? `${experience.yearsOfExperience} years`
              : levelLabels[experience.experienceLevel]}
          </span>
          <span>·</span>
          <span>
            {experience.roleLevel
              ? roleLevelLabels[experience.roleLevel]
              : levelLabels[experience.experienceLevel]}
          </span>
          <span>·</span>
          <span>{experience.interviewYear}</span>
          {experience.location && (
            <>
              <span>·</span>
              <span>{experience.location}</span>
            </>
          )}
          <span>·</span>
          <span>{resultLabels[experience.result]}</span>
        </div>
        {experience.author?.name && (
          <p className="text-sm text-muted-foreground">
            Shared by <span className="text-foreground">{experience.author.name}</span>
          </p>
        )}
      </header>

      <section className="glass-panel space-y-3 p-6">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {experience.overview}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Interview rounds</h2>
        {experience.rounds.map((round, index) => (
          <div key={round.id ?? index} className="glass-panel space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                {index + 1}. {round.name}
              </h3>
              <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs text-muted-foreground">
                {roundTypeLabels[round.roundType]}
              </span>
              {round.duration && (
                <span className="text-xs text-muted-foreground">{round.duration}</span>
              )}
              {round.difficulty && (
                <span className="text-xs text-muted-foreground">
                  {difficultyLabels[round.difficulty as keyof typeof difficultyLabels] ??
                    round.difficulty}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Questions asked
              </p>
              <div className="mt-2">
                <QuestionsList questionsAsked={round.questionsAsked} />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Your experience
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {round.candidateExperience}
              </p>
            </div>
            {round.outcome && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Outcome:</span> {round.outcome}
              </p>
            )}
          </div>
        ))}
      </section>

      <section className="glass-panel space-y-3 p-6">
        <h2 className="text-lg font-semibold">Preparation tips</h2>
        <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {experience.preparationTips}
        </p>
      </section>

      <section className="glass-panel space-y-3 p-6">
        <h2 className="text-lg font-semibold">Final advice</h2>
        <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {experience.finalAdvice}
        </p>
      </section>
    </div>
  );
}
