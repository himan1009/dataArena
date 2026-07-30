"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { CompanyTagInput } from "@/components/practice/company-tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import {
  PracticeApiError,
  difficultyLabels,
  platformLabels,
  practiceApi,
  type PracticeCategory,
  type PracticeDifficulty,
  type PracticePlatform,
  type PracticeQuestion,
} from "@/lib/practice-api";

type FormState = {
  title: string;
  platform: PracticePlatform;
  questionUrl: string;
  difficulty: PracticeDifficulty;
  categoryId: string;
  topicId: string;
  companyTags: string[];
  estimatedTime: string;
  description: string;
};

function toFormState(
  categories: PracticeCategory[],
  initialQuestion?: PracticeQuestion,
  defaults?: { categoryId?: string; topicId?: string },
): FormState {
  const categoryId =
    initialQuestion?.category.id ?? defaults?.categoryId ?? categories[0]?.id ?? "";
  const topics =
    categories.find((category) => category.id === categoryId)?.topics ?? [];
  const topicId =
    initialQuestion?.topic.id ??
    defaults?.topicId ??
    topics[0]?.id ??
    "";

  return {
    title: initialQuestion?.title ?? "",
    platform: initialQuestion?.platform ?? "LEETCODE",
    questionUrl: initialQuestion?.questionUrl ?? "",
    difficulty: initialQuestion?.difficulty ?? "MEDIUM",
    categoryId,
    topicId,
    companyTags: initialQuestion?.companyTags ?? [],
    estimatedTime: initialQuestion?.estimatedTime ?? "",
    description: initialQuestion?.description ?? "",
  };
}

export function PracticeQuestionForm({
  categories,
  initialQuestion,
  defaultCategoryId,
  defaultTopicId,
}: {
  categories: PracticeCategory[];
  initialQuestion?: PracticeQuestion;
  defaultCategoryId?: string;
  defaultTopicId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    toFormState(categories, initialQuestion, {
      categoryId: defaultCategoryId,
      topicId: defaultTopicId,
    }),
  );
  const [loadingAction, setLoadingAction] = useState<"draft" | "submit" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categories.length) return;
    setForm((current) => {
      const categoryExists = categories.some((category) => category.id === current.categoryId);
      const categoryId = categoryExists ? current.categoryId : categories[0].id;
      const topics = categories.find((category) => category.id === categoryId)?.topics ?? [];
      const topicExists = topics.some((topic) => topic.id === current.topicId);
      const topicId = topicExists ? current.topicId : topics[0]?.id ?? "";
      return { ...current, categoryId, topicId };
    });
  }, [categories]);

  const topics = useMemo(
    () => categories.find((category) => category.id === form.categoryId)?.topics ?? [],
    [categories, form.categoryId],
  );

  const payload = {
    title: form.title.trim(),
    platform: form.platform,
    questionUrl: form.questionUrl.trim(),
    difficulty: form.difficulty,
    categoryId: form.categoryId,
    topicId: form.topicId,
    companyTags: form.companyTags,
    estimatedTime: form.estimatedTime.trim() || undefined,
    description: form.description.trim() || undefined,
  };

  const save = async (submit: boolean) => {
    setError(null);

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }
    if (!form.topicId) {
      setError("Please select a topic.");
      return;
    }

    setLoadingAction(submit ? "submit" : "draft");

    try {
      if (initialQuestion) {
        await practiceApi.update(initialQuestion.id, payload);
        if (submit) {
          await practiceApi.submit(initialQuestion.id);
        }
      } else if (submit) {
        await practiceApi.createAndSubmit(payload);
      } else {
        await practiceApi.create(payload);
      }
      router.push("/practice/my");
      router.refresh();
    } catch (err) {
      setError(err instanceof PracticeApiError ? err.message : "Failed to save question");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save(true);
      }}
    >
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="glass-panel space-y-5 p-6">
        <div>
          <h2 className="text-lg font-semibold">Where does this question belong?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the category first, then the topic inside it.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <SelectField
              value={form.categoryId}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  categoryId: value,
                  topicId:
                    categories.find((category) => category.id === value)?.topics?.[0]?.id ?? "",
                }))
              }
              placeholder="Select category"
              disabled={!categories.length}
            />
          </div>

          <div className="space-y-2">
            <Label>Topic</Label>
            <SelectField
              value={form.topicId}
              options={topics.map((topic) => ({ value: topic.id, label: topic.name }))}
              onValueChange={(value) => setForm((current) => ({ ...current, topicId: value }))}
              placeholder={topics.length ? "Select topic" : "No topics in this category"}
              disabled={!form.categoryId || topics.length === 0}
            />
          </div>
        </div>
      </section>

      <section className="glass-panel space-y-5 p-6">
        <div>
          <h2 className="text-lg font-semibold">Question details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add the title and link. Learners open the link to solve on the original platform.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="practice-title">Question title</Label>
            <Input
              id="practice-title"
              className="surface-input"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="practice-url">Question URL</Label>
            <Input
              id="practice-url"
              className="surface-input"
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={form.questionUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, questionUrl: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Platform</Label>
            <SelectField
              value={form.platform}
              options={Object.entries(platformLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, platform: value as PracticePlatform }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <SelectField
              value={form.difficulty}
              options={Object.entries(difficultyLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, difficulty: value as PracticeDifficulty }))
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Company tags</Label>
            <CompanyTagInput
              tags={form.companyTags}
              onChange={(companyTags) => setForm((current) => ({ ...current, companyTags }))}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="practice-time">Estimated time (optional)</Label>
            <Input
              id="practice-time"
              className="surface-input"
              placeholder="30 min"
              value={form.estimatedTime}
              onChange={(event) =>
                setForm((current) => ({ ...current, estimatedTime: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="practice-description">Notes for reviewers (optional)</Label>
            <textarea
              id="practice-description"
              className="min-h-28 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={loadingAction !== null || !form.topicId}
          onClick={() => void save(false)}
        >
          {loadingAction === "draft" && <Loader2 className="size-4 animate-spin" />}
          Save draft
        </Button>
        <Button type="submit" disabled={loadingAction !== null || !form.topicId}>
          {loadingAction === "submit" && <Loader2 className="size-4 animate-spin" />}
          Submit for review
        </Button>
      </div>
    </form>
  );
}
