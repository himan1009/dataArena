"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import {
  PracticeApiError,
  difficultyLabels,
  practiceApi,
  questionStatusLabels,
  type AdminPracticeCategory,
  type PracticeDifficulty,
  type PracticeQuestionStatus,
} from "@/lib/practice-api";
import { slugify } from "@/lib/notes-utils";
import { cn } from "@/lib/utils";

export function AdminPracticePanel({
  categories,
}: {
  categories: AdminPracticeCategory[];
}) {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [topicForm, setTopicForm] = useState({
    categoryId: categories[0]?.id ?? "",
    name: "",
    slug: "",
  });
  const [manageCategoryId, setManageCategoryId] = useState(categories[0]?.id ?? "");
  const [manageTopicId, setManageTopicId] = useState("");

  useEffect(() => {
    if (!categories.length) {
      setTopicForm((current) =>
        current.categoryId ? { ...current, categoryId: "" } : current,
      );
      setManageCategoryId("");
      setManageTopicId("");
      return;
    }

    if (!categories.some((category) => category.id === topicForm.categoryId)) {
      setTopicForm((current) => ({ ...current, categoryId: categories[0].id }));
    }

    if (!categories.some((category) => category.id === manageCategoryId)) {
      setManageCategoryId(categories[0].id);
      setManageTopicId("");
    }
  }, [categories, topicForm.categoryId, manageCategoryId]);

  const manageCategory = useMemo(
    () => categories.find((category) => category.id === manageCategoryId),
    [categories, manageCategoryId],
  );
  const manageTopics = manageCategory?.topics ?? [];
  const manageTopic = useMemo(
    () => manageTopics.find((topic) => topic.id === manageTopicId),
    [manageTopics, manageTopicId],
  );

  const run = async (key: string, action: () => Promise<unknown>) => {
    setError(null);
    setLoadingKey(key);
    try {
      await action();
      router.refresh();
    } catch (err) {
      setError(err instanceof PracticeApiError ? err.message : "Action failed");
    } finally {
      setLoadingKey(null);
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const canCreateTopic =
    Boolean(topicForm.categoryId) &&
    Boolean(topicForm.name.trim()) &&
    Boolean(topicForm.slug.trim());

  const handleDeleteCategory = async () => {
    if (!manageCategory) return;
    if (
      !window.confirm(
        `Delete category "${manageCategory.name}" and all its topics? You must delete every question in this category first.`,
      )
    ) {
      return;
    }
    await run(`delete-category-${manageCategory.id}`, () =>
      practiceApi.adminDeleteCategory(manageCategory.id),
    );
    setManageTopicId("");
  };

  const handleDeleteTopic = async () => {
    if (!manageTopic) return;
    if (
      !window.confirm(
        `Delete topic "${manageTopic.name}"? Delete all questions in this topic first.`,
      )
    ) {
      return;
    }
    await run(`delete-topic-${manageTopic.id}`, () =>
      practiceApi.adminDeleteTopic(manageTopic.id),
    );
    setManageTopicId("");
  };

  const handleDeleteQuestion = async (questionId: string, title: string) => {
    if (!window.confirm(`Delete question "${title}"? This cannot be undone.`)) {
      return;
    }
    await run(`delete-question-${questionId}`, () =>
      practiceApi.adminDeleteQuestion(questionId),
    );
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="glass-panel space-y-4 p-6">
        <h2 className="text-lg font-semibold">Create category</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              className="surface-input"
              value={categoryForm.name}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: current.slug || slugify(event.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              className="surface-input"
              value={categoryForm.slug}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  slug: slugify(event.target.value),
                }))
              }
            />
          </div>
        </div>
        <Button
          disabled={loadingKey === "category" || !categoryForm.name.trim()}
          onClick={() =>
            run("category", () => practiceApi.adminCreateCategory(categoryForm))
          }
        >
          {loadingKey === "category" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Add category
        </Button>
      </section>

      <section className="glass-panel space-y-4 p-6">
        <h2 className="text-lg font-semibold">Create topic</h2>
        <p className="text-sm text-muted-foreground">
          Questions are attached directly to topics. Pick a category first, then add the topic.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Category</Label>
            <SelectField
              value={topicForm.categoryId}
              options={categoryOptions}
              onValueChange={(value) =>
                setTopicForm((current) => ({ ...current, categoryId: value }))
              }
              placeholder={categories.length ? "Select category" : "Create a category first"}
              disabled={!categories.length}
            />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              className="surface-input"
              value={topicForm.name}
              onChange={(event) =>
                setTopicForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: current.slug || slugify(event.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              className="surface-input"
              value={topicForm.slug}
              onChange={(event) =>
                setTopicForm((current) => ({
                  ...current,
                  slug: slugify(event.target.value),
                }))
              }
            />
          </div>
        </div>
        <Button
          disabled={loadingKey === "topic" || !canCreateTopic}
          onClick={() => run("topic", () => practiceApi.adminCreateTopic(topicForm))}
        >
          {loadingKey === "topic" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Add topic
        </Button>
      </section>

      <section className="glass-panel space-y-4 p-6">
        <div>
          <h2 className="text-lg font-semibold">Manage & delete</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Delete in this order: <strong className="text-foreground">questions</strong> →{" "}
            <strong className="text-foreground">topics</strong> →{" "}
            <strong className="text-foreground">categories</strong>.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <Label>Category</Label>
                  <SelectField
                    value={manageCategoryId}
                    options={categoryOptions}
                    onValueChange={(value) => {
                      setManageCategoryId(value);
                      setManageTopicId("");
                    }}
                    placeholder="Choose a category"
                  />
                  {manageCategory && (
                    <p className="text-xs text-muted-foreground">
                      /practice/{manageCategory.slug} ·{" "}
                      {manageCategory._count?.questions ?? 0} questions ·{" "}
                      {manageTopics.length} topics
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
                  disabled={!manageCategory || loadingKey === `delete-category-${manageCategory?.id}`}
                  onClick={() => void handleDeleteCategory()}
                >
                  {loadingKey === `delete-category-${manageCategory?.id}` ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Delete category
                </Button>
              </div>
            </div>

            {manageCategory && (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div className="space-y-2">
                  <Label>Topics in {manageCategory.name}</Label>
                  <div className="app-scrollbar max-h-72 overflow-y-auto rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
                    {manageTopics.length === 0 ? (
                      <p className="px-2 py-3 text-sm text-muted-foreground">No topics yet.</p>
                    ) : (
                      manageTopics.map((topic, index) => {
                        const isSelected = topic.id === manageTopicId;
                        const questionCount = topic.questions?.length ?? topic._count?.questions ?? 0;

                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() =>
                              setManageTopicId((current) =>
                                current === topic.id ? "" : topic.id,
                              )
                            }
                            className={cn(
                              "mb-1 flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors last:mb-0",
                              isSelected
                                ? "border-primary/40 bg-primary/10 text-foreground ring-1 ring-primary/20"
                                : "border-transparent text-muted-foreground hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-foreground",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-white/15 bg-white/[0.03]",
                              )}
                            >
                              {isSelected ? <Check className="size-3" /> : index + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{topic.name}</span>
                              <span className="mt-0.5 block truncate text-xs opacity-80">
                                {topic.slug} · {questionCount}{" "}
                                {questionCount === 1 ? "question" : "questions"}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
                  {!manageTopic ? (
                    <div className="flex min-h-48 flex-col items-center justify-center text-center">
                      <p className="text-sm font-medium text-muted-foreground">Select a topic</p>
                      <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                        Choose a topic to delete it or remove individual questions.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            Selected topic
                          </p>
                          <p className="mt-2 text-lg font-semibold">{manageTopic.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            /practice/{manageCategory.slug}/{manageTopic.slug}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                          disabled={loadingKey === `delete-topic-${manageTopic.id}`}
                          onClick={() => void handleDeleteTopic()}
                        >
                          {loadingKey === `delete-topic-${manageTopic.id}` ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                          Delete topic
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Questions</Label>
                        {(manageTopic.questions ?? []).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No questions in this topic.</p>
                        ) : (
                          <div className="space-y-2">
                            {(manageTopic.questions ?? []).map((question, index) => (
                              <div
                                key={question.id}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3"
                              >
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-semibold text-primary">
                                      {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="truncate text-sm font-medium">
                                      {question.title}
                                    </span>
                                    <Badge className="bg-white/10 text-[10px] text-foreground">
                                      {questionStatusLabels[question.status]}
                                    </Badge>
                                    <Badge className="bg-white/10 text-[10px] text-muted-foreground">
                                      {difficultyLabels[question.difficulty]}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  disabled={loadingKey === `delete-question-${question.id}`}
                                  onClick={() =>
                                    void handleDeleteQuestion(question.id, question.title)
                                  }
                                >
                                  {loadingKey === `delete-question-${question.id}` ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-4" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
