"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { InterviewExperienceDetail } from "@/components/interviews/interview-experience-detail";
import {
  InterviewApiError,
  interviewExperiencesApi,
  difficultyLabels,
  resultLabels,
  roleLevelLabels,
  roundTypeLabels,
  yearsOfExperienceOptions,
  type InterviewExperience,
  type InterviewExperiencePayload,
  type InterviewResult,
  type InterviewRound,
  type InterviewRoundType,
  type RoleLevel,
  type RoundDifficulty,
} from "@/lib/interview-experiences-api";

type RoundQuestion = {
  id: string;
  text: string;
};

type RoundFormState = {
  roundType: InterviewRoundType;
  durationMinutes: string;
  difficulty: RoundDifficulty | "";
  questions: RoundQuestion[];
  candidateExperience: string;
  outcome: string;
};

const guidelines = [
  "Share only your own interview experience.",
  "Avoid confidential company information.",
  "Do not mention interviewer personal details.",
  "Keep the experience factual and respectful.",
];

function formatRoundName(index: number) {
  const roundNumber = index + 1;
  if (roundNumber === 1) return "1st Round";
  if (roundNumber === 2) return "2nd Round";
  if (roundNumber === 3) return "3rd Round";
  return `${roundNumber}th Round`;
}

function createQuestion(text = ""): RoundQuestion {
  return { id: crypto.randomUUID(), text };
}

function parseQuestions(questionsAsked: string): RoundQuestion[] {
  try {
    const parsed = JSON.parse(questionsAsked) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, index) => ({
        id: `q-${index}-${crypto.randomUUID()}`,
        text:
          typeof item === "string"
            ? item
            : typeof item === "object" && item && "text" in item
              ? String((item as { text?: string }).text ?? "")
              : "",
      }));
    }
  } catch {
    // Legacy plain-text questions
  }

  if (questionsAsked.trim()) {
    return [createQuestion(questionsAsked)];
  }

  return [createQuestion()];
}

function parseDurationMinutes(duration?: string | null) {
  if (!duration) return "";
  const match = duration.match(/(\d+)/);
  return match?.[1] ?? "";
}

function emptyRound(): RoundFormState {
  return {
    roundType: "TECHNICAL",
    durationMinutes: "",
    difficulty: "",
    questions: [createQuestion()],
    candidateExperience: "",
    outcome: "",
  };
}

function roundFromApi(round: InterviewRound): RoundFormState {
  return {
    roundType: round.roundType,
    durationMinutes: parseDurationMinutes(round.duration),
    difficulty: (round.difficulty as RoundDifficulty | null) ?? "",
    questions: parseQuestions(round.questionsAsked),
    candidateExperience: round.candidateExperience,
    outcome: round.outcome ?? "",
  };
}

function serializeRound(round: RoundFormState, index: number): InterviewRound {
  const questionTexts = round.questions
    .map((question) => question.text.trim())
    .filter(Boolean);

  return {
    name: formatRoundName(index),
    roundType: round.roundType,
    duration: round.durationMinutes ? `${round.durationMinutes} min` : undefined,
    difficulty: round.difficulty || undefined,
    questionsAsked: JSON.stringify(questionTexts),
    candidateExperience: round.candidateExperience,
    outcome: round.outcome || undefined,
  };
}

type Props = {
  initial?: InterviewExperience;
};

export function InterviewSubmissionWizard({ initial }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [experienceId, setExperienceId] = useState(initial?.id ?? "");

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    company: initial?.company ?? "",
    role: initial?.role ?? "",
    yearsOfExperience: initial?.yearsOfExperience ?? "1+",
    roleLevel: (initial?.roleLevel ?? "MID") as RoleLevel,
    interviewYear: initial?.interviewYear ?? new Date().getFullYear(),
    location: initial?.location ?? "",
    result: (initial?.result ?? "PENDING") as InterviewResult,
    overview: initial?.overview ?? "",
    preparationTips: initial?.preparationTips ?? "",
    finalAdvice: initial?.finalAdvice ?? "",
    rounds:
      initial?.rounds && initial.rounds.length > 0
        ? initial.rounds.map(roundFromApi)
        : [emptyRound()],
  });

  const previewExperience: InterviewExperience = {
    id: experienceId || "preview",
    slug: "preview",
    status: initial?.status ?? "DRAFT",
    reviewComment: initial?.reviewComment ?? null,
    submittedAt: initial?.submittedAt ?? null,
    reviewedAt: initial?.reviewedAt ?? null,
    publishedAt: initial?.publishedAt ?? null,
    updatedAt: new Date().toISOString(),
    author: initial?.author ?? null,
    title: form.title,
    company: form.company,
    role: form.role,
    experienceLevel: initial?.experienceLevel ?? "MID",
    yearsOfExperience: form.yearsOfExperience,
    roleLevel: form.roleLevel,
    interviewYear: form.interviewYear,
    location: form.location || null,
    result: form.result,
    overview: form.overview,
    preparationTips: form.preparationTips,
    finalAdvice: form.finalAdvice,
    rounds: form.rounds.map((round, index) => serializeRound(round, index)),
  };

  const buildPayload = (): InterviewExperiencePayload => ({
    title: form.title,
    company: form.company,
    role: form.role,
    yearsOfExperience: form.yearsOfExperience,
    roleLevel: form.roleLevel,
    interviewYear: form.interviewYear,
    location: form.location || undefined,
    result: form.result,
    overview: form.overview,
    preparationTips: form.preparationTips,
    finalAdvice: form.finalAdvice,
    rounds: form.rounds.map((round, index) => serializeRound(round, index)),
  });

  const save = async (submit = false) => {
    setError(null);
    setSaving(true);

    try {
      const payload = buildPayload();

      let id = experienceId;
      if (id) {
        await interviewExperiencesApi.update(id, payload);
      } else {
        const created = await interviewExperiencesApi.create(payload);
        id = created.experience.id;
        setExperienceId(id);
      }

      if (submit) {
        await interviewExperiencesApi.submit(id);
        router.push("/interviews/my");
        router.refresh();
        return;
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof InterviewApiError ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const updateRound = (index: number, patch: Partial<RoundFormState>) => {
    setForm((current) => ({
      ...current,
      rounds: current.rounds.map((round, roundIndex) =>
        roundIndex === index ? { ...round, ...patch } : round,
      ),
    }));
  };

  const updateQuestion = (
    roundIndex: number,
    questionIndex: number,
    text: string,
  ) => {
    setForm((current) => ({
      ...current,
      rounds: current.rounds.map((round, index) =>
        index === roundIndex
          ? {
              ...round,
              questions: round.questions.map((question, qIndex) =>
                qIndex === questionIndex ? { ...question, text } : question,
              ),
            }
          : round,
      ),
    }));
  };

  const addQuestion = (roundIndex: number) => {
    setForm((current) => ({
      ...current,
      rounds: current.rounds.map((round, index) =>
        index === roundIndex
          ? { ...round, questions: [...round.questions, createQuestion()] }
          : round,
      ),
    }));
  };

  const removeQuestion = (roundIndex: number, questionIndex: number) => {
    setForm((current) => ({
      ...current,
      rounds: current.rounds.map((round, index) => {
        if (index !== roundIndex) return round;
        if (round.questions.length <= 1) return round;
        return {
          ...round,
          questions: round.questions.filter((_, qIndex) => qIndex !== questionIndex),
        };
      }),
    }));
  };

  const steps = [
    "Basic info",
    "Overview",
    "Rounds",
    "Preparation",
    "Advice",
    "Preview",
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-4">
        <div className="app-scrollbar flex flex-wrap gap-2 overflow-x-auto pb-1">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                step === index
                  ? "bg-primary/15 text-primary"
                  : "bg-white/[0.04] text-muted-foreground hover:text-foreground"
              }`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === 0 && (
        <section className="glass-panel grid gap-4 p-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Title</Label>
            <Input
              className="surface-input"
              value={form.title}
              onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
              placeholder="Amazon SDE-2 onsite experience"
            />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              className="surface-input"
              value={form.company}
              onChange={(e) => setForm((c) => ({ ...c, company: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              className="surface-input"
              value={form.role}
              onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Years of experience</Label>
            <SelectField
              value={form.yearsOfExperience}
              options={yearsOfExperienceOptions.map((value) => ({
                value,
                label: `${value} years`,
              }))}
              onValueChange={(value) =>
                setForm((c) => ({ ...c, yearsOfExperience: value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Role level</Label>
            <SelectField
              value={form.roleLevel}
              options={Object.entries(roleLevelLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              onValueChange={(value) =>
                setForm((c) => ({ ...c, roleLevel: value as RoleLevel }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Interview year</Label>
            <Input
              className="surface-input"
              type="number"
              value={form.interviewYear}
              onChange={(e) =>
                setForm((c) => ({ ...c, interviewYear: Number(e.target.value) }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Location (optional)</Label>
            <Input
              className="surface-input"
              value={form.location}
              onChange={(e) => setForm((c) => ({ ...c, location: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Result</Label>
            <SelectField
              value={form.result}
              options={Object.entries(resultLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              onValueChange={(value) =>
                setForm((c) => ({ ...c, result: value as InterviewResult }))
              }
            />
          </div>
          <div className="sm:col-span-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Content guidelines</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {guidelines.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="glass-panel space-y-2 p-6">
          <Label>Interview overview</Label>
          <textarea
            className="app-scrollbar min-h-48 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
            value={form.overview}
            onChange={(e) => setForm((c) => ({ ...c, overview: e.target.value }))}
            placeholder="Describe the overall hiring process..."
          />
        </section>
      )}

      {step === 2 && (
        <section className="app-scrollbar max-h-[calc(100vh-16rem)] space-y-4 overflow-y-auto pr-1">
          {form.rounds.map((round, index) => (
            <div key={index} className="glass-panel space-y-4 p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{formatRoundName(index)}</h3>
                {form.rounds.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive"
                    onClick={() =>
                      setForm((c) => ({
                        ...c,
                        rounds: c.rounds.filter((_, roundIndex) => roundIndex !== index),
                      }))
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Round type</Label>
                  <SelectField
                    value={round.roundType}
                    options={Object.entries(roundTypeLabels).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                    onValueChange={(value) =>
                      updateRound(index, { roundType: value as InterviewRoundType })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    className="surface-input"
                    type="number"
                    min={1}
                    max={480}
                    inputMode="numeric"
                    placeholder="e.g. 30"
                    value={round.durationMinutes}
                    onChange={(e) =>
                      updateRound(index, { durationMinutes: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <SelectField
                    value={round.difficulty}
                    options={[
                      { value: "", label: "Select difficulty" },
                      ...Object.entries(difficultyLabels).map(([value, label]) => ({
                        value,
                        label,
                      })),
                    ]}
                    onValueChange={(value) =>
                      updateRound(index, { difficulty: value as RoundDifficulty | "" })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Questions asked</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-white/10 bg-white/[0.03]"
                    onClick={() => addQuestion(index)}
                  >
                    <Plus className="size-4" />
                    Add question
                  </Button>
                </div>

                {round.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">
                        Question {questionIndex + 1}
                      </p>
                      {round.questions.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-destructive/30 text-destructive"
                          onClick={() => removeQuestion(index, questionIndex)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                    <textarea
                      className="app-scrollbar min-h-24 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(index, questionIndex, e.target.value)
                      }
                      placeholder="What question were you asked?"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Your experience in this round</Label>
                <textarea
                  className="app-scrollbar min-h-28 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
                  value={round.candidateExperience}
                  onChange={(e) =>
                    updateRound(index, { candidateExperience: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Outcome (optional)</Label>
                <Input
                  className="surface-input"
                  value={round.outcome}
                  onChange={(e) => updateRound(index, { outcome: e.target.value })}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/[0.03]"
            onClick={() =>
              setForm((c) => ({ ...c, rounds: [...c.rounds, emptyRound()] }))
            }
          >
            <Plus className="size-4" />
            Add another round
          </Button>
        </section>
      )}

      {step === 3 && (
        <section className="glass-panel space-y-2 p-6">
          <Label>Preparation tips</Label>
          <textarea
            className="app-scrollbar min-h-48 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
            value={form.preparationTips}
            onChange={(e) =>
              setForm((c) => ({ ...c, preparationTips: e.target.value }))
            }
            placeholder="What helped most? Important topics? Resources used?"
          />
        </section>
      )}

      {step === 4 && (
        <section className="glass-panel space-y-2 p-6">
          <Label>Final advice</Label>
          <textarea
            className="app-scrollbar min-h-48 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
            value={form.finalAdvice}
            onChange={(e) => setForm((c) => ({ ...c, finalAdvice: e.target.value }))}
            placeholder="Advice for future candidates..."
          />
        </section>
      )}

      {step === 5 && <InterviewExperienceDetail experience={previewExperience} />}

      <div className="flex flex-wrap gap-3">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {step < steps.length - 1 && (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          className="border-white/10 bg-white/[0.03]"
          disabled={saving}
          onClick={() => save(false)}
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          Save draft
        </Button>
        {step === steps.length - 1 && (
          <Button type="button" disabled={saving} onClick={() => save(true)}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Submit for review
          </Button>
        )}
      </div>
    </div>
  );
}
