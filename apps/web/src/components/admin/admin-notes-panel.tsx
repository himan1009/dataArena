"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { useAsyncAction } from "@/hooks/use-async-action";
import { ApiError, notesApi } from "@/lib/notes-api";
import { slugify } from "@/lib/notes-utils";
import { cn } from "@/lib/utils";

type AdminTopic = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  openForAuthors: boolean;
};

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  published: boolean;
  sortOrder: number;
  topicCount?: number;
  topics?: AdminTopic[];
};

const initialCategoryForm = {
  name: "",
  slug: "",
  description: "",
  icon: "BookOpen",
};

const initialArticleContent = "# New article\n\nStart writing markdown here.";

function createInitialTopicForm(categoryId = "") {
  return {
    categoryId,
    name: "",
    slug: "",
    description: "",
    openForAuthors: true,
  };
}

function createInitialArticleForm(topicId = "") {
  return {
    topicId,
    title: "",
    slug: "",
    content: initialArticleContent,
  };
}

export function AdminNotesPanel({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const { run, isLoading } = useAsyncAction();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);

  const [topicForm, setTopicForm] = useState(() =>
    createInitialTopicForm(categories[0]?.id ?? ""),
  );

  const allTopics = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.topics ?? []).map((topic) => ({
          ...topic,
          categoryName: category.name,
        })),
      ),
    [categories],
  );

  const [articleForm, setArticleForm] = useState(() =>
    createInitialArticleForm(allTopics[0]?.id ?? ""),
  );

  const [manageCategoryId, setManageCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const [manageTopicId, setManageTopicId] = useState(
    categories[0]?.topics?.[0]?.id ?? "",
  );

  const manageCategory = useMemo(
    () => categories.find((category) => category.id === manageCategoryId),
    [categories, manageCategoryId],
  );

  const manageTopics = manageCategory?.topics ?? [];

  const manageTopic = useMemo(
    () => manageTopics.find((topic) => topic.id === manageTopicId),
    [manageTopics, manageTopicId],
  );

  useEffect(() => {
    if (!categories.length) {
      setManageCategoryId("");
      setManageTopicId("");
      return;
    }

    if (!categories.some((category) => category.id === manageCategoryId)) {
      setManageCategoryId(categories[0].id);
    }
  }, [categories, manageCategoryId]);

  useEffect(() => {
    if (!manageTopics.length) {
      setManageTopicId("");
      return;
    }

    if (!manageTopics.some((topic) => topic.id === manageTopicId)) {
      setManageTopicId(manageTopics[0].id);
    }
  }, [manageTopics, manageTopicId]);

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      setError(err.message);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: category.id, label: category.name })),
    [categories],
  );

  const articleTopicOptions = useMemo(
    () =>
      allTopics.map((topic) => ({
        value: topic.id,
        label: `${topic.categoryName} · ${topic.name}`,
      })),
    [allTopics],
  );

  useEffect(() => {
    if (!categories.length) {
      setTopicForm((current) =>
        current.categoryId ? { ...current, categoryId: "" } : current,
      );
      return;
    }

    if (!categories.some((category) => category.id === topicForm.categoryId)) {
      setTopicForm((current) => ({
        ...current,
        categoryId: categories[0].id,
      }));
    }
  }, [categories, topicForm.categoryId]);

  useEffect(() => {
    if (!allTopics.length) {
      setArticleForm((current) =>
        current.topicId ? { ...current, topicId: "" } : current,
      );
      return;
    }

    if (!allTopics.some((topic) => topic.id === articleForm.topicId)) {
      setArticleForm((current) => ({
        ...current,
        topicId: allTopics[0].id,
      }));
    }
  }, [allTopics, articleForm.topicId]);

  const submit = async (
    key: string,
    action: () => Promise<unknown>,
    successMessage = "Saved successfully.",
    onSuccess?: (result: unknown) => void,
  ) => {
    setMessage(null);
    setError(null);

    try {
      const result = await run(key, action);
      setMessage(successMessage);
      onSuccess?.(result);
      router.refresh();
    } catch (err) {
      handleError(err);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setManageCategoryId(categoryId);
    const nextCategory = categories.find((category) => category.id === categoryId);
    setManageTopicId(nextCategory?.topics?.[0]?.id ?? "");
  };

  const handleDeleteCategory = async () => {
    if (!manageCategory) {
      setError("Select a category to delete.");
      return;
    }

    if (
      !window.confirm(
        `Delete category "${manageCategory.name}" and all of its topics and articles? This cannot be undone.`,
      )
    ) {
      return;
    }

    const deletedCategory = manageCategory;
    const submitKey = `delete-category-${deletedCategory.id}`;

    setMessage(null);
    setError(null);

    try {
      await run(submitKey, () => notesApi.deleteCategory(deletedCategory.id));
      setMessage(`Category "${deletedCategory.name}" deleted.`);

      const nextCategory = categories.find(
        (category) => category.id !== deletedCategory.id,
      );

      if (nextCategory) {
        handleCategoryChange(nextCategory.id);
      } else {
        setManageCategoryId("");
        setManageTopicId("");
      }

      router.refresh();
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteTopic = async () => {
    if (!manageTopic) {
      setError("Select a topic to delete.");
      return;
    }

    if (
      !window.confirm(
        `Delete topic "${manageTopic.name}" and all of its articles? This cannot be undone.`,
      )
    ) {
      return;
    }

    const deletedTopic = manageTopic;
    const submitKey = `delete-topic-${deletedTopic.id}`;

    setMessage(null);
    setError(null);

    try {
      await run(submitKey, () => notesApi.deleteTopic(deletedTopic.id));
      setMessage(`Topic "${deletedTopic.name}" deleted.`);

      const remainingTopics = manageTopics.filter(
        (topic) => topic.id !== deletedTopic.id,
      );
      setManageTopicId(remainingTopics[0]?.id ?? "");

      router.refresh();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="glass-panel p-6 sm:p-8">
        <h3 className="font-semibold tracking-tight">Create category</h3>
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            submit(
              "category",
              () =>
                notesApi.createCategory({
                  name: categoryForm.name,
                  slug: categoryForm.slug || slugify(categoryForm.name),
                  description: categoryForm.description || undefined,
                  icon: categoryForm.icon || undefined,
                }),
              "Category created.",
              (result) => {
                setCategoryForm(initialCategoryForm);
                const created = result as { id?: string } | undefined;
                if (created?.id) {
                  setTopicForm(createInitialTopicForm(created.id));
                  setManageCategoryId(created.id);
                }
              },
            );
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              className="surface-input"
              value={categoryForm.name}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: current.slug || slugify(event.target.value),
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-slug">Slug</Label>
            <Input
              id="category-slug"
              className="surface-input"
              value={categoryForm.slug}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  slug: slugify(event.target.value),
                }))
              }
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="category-description">Description</Label>
            <Input
              id="category-description"
              className="surface-input"
              value={categoryForm.description}
              onChange={(event) =>
                setCategoryForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </div>
          <div className="sm:col-span-2">
            <LoadingButton
              type="submit"
              loading={isLoading("category")}
              loadingLabel="Creating category..."
            >
              Create category
            </LoadingButton>
          </div>
        </form>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <h3 className="font-semibold tracking-tight">Create topic</h3>
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            submit(
              "topic",
              () =>
                notesApi.createTopic({
                  categoryId: topicForm.categoryId,
                  name: topicForm.name,
                  slug: topicForm.slug || slugify(topicForm.name),
                  description: topicForm.description || undefined,
                  openForAuthors: topicForm.openForAuthors,
                }),
              "Topic created.",
              (result) => {
                const created = result as { id?: string } | undefined;
                setTopicForm(createInitialTopicForm(topicForm.categoryId));
                if (created?.id) {
                  setManageCategoryId(topicForm.categoryId);
                  setManageTopicId(created.id);
                }
              },
            );
          }}
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="topic-category">Category</Label>
            <SelectField
              id="topic-category"
              value={topicForm.categoryId}
              options={categoryOptions}
              onValueChange={(value) =>
                setTopicForm((current) => ({
                  ...current,
                  categoryId: value,
                }))
              }
              placeholder={categories.length ? "Choose a category" : "Create a category first"}
              disabled={!categories.length}
              required
            />
            {!categories.length && (
              <p className="text-xs text-muted-foreground">
                Create a category above before adding topics.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic-name">Name</Label>
            <Input
              id="topic-name"
              className="surface-input"
              value={topicForm.name}
              onChange={(event) =>
                setTopicForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: current.slug || slugify(event.target.value),
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic-slug">Slug</Label>
            <Input
              id="topic-slug"
              className="surface-input"
              value={topicForm.slug}
              onChange={(event) =>
                setTopicForm((current) => ({
                  ...current,
                  slug: slugify(event.target.value),
                }))
              }
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="topic-description">Description</Label>
            <Input
              id="topic-description"
              className="surface-input"
              value={topicForm.description}
              onChange={(event) =>
                setTopicForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 sm:col-span-2">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-white/20 accent-primary"
              checked={topicForm.openForAuthors}
              onChange={(event) =>
                setTopicForm((current) => ({
                  ...current,
                  openForAuthors: event.target.checked,
                }))
              }
            />
            <span className="space-y-1">
              <span className="block text-sm font-medium">Open for authors</span>
              <span className="block text-xs text-muted-foreground">
                Editors can write this topic after you assign them under Admin →
                Assign writers.
              </span>
            </span>
          </label>
          <div className="sm:col-span-2">
            <LoadingButton
              type="submit"
              loading={isLoading("topic")}
              loadingLabel="Creating topic..."
              disabled={!categories.length}
            >
              Create topic
            </LoadingButton>
          </div>
        </form>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <h3 className="font-semibold tracking-tight">Create article</h3>
        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit(
              "article",
              () =>
                notesApi.createArticleAdmin({
                  topicId: articleForm.topicId,
                  title: articleForm.title,
                  slug: articleForm.slug || slugify(articleForm.title),
                  content: articleForm.content,
                }),
              "Article created.",
              () => {
                setArticleForm(createInitialArticleForm(articleForm.topicId));
              },
            );
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="article-topic">Topic</Label>
            <SelectField
              id="article-topic"
              value={articleForm.topicId}
              options={articleTopicOptions}
              onValueChange={(value) =>
                setArticleForm((current) => ({
                  ...current,
                  topicId: value,
                }))
              }
              placeholder={allTopics.length ? "Choose a topic" : "Create a topic first"}
              disabled={!allTopics.length}
              required
            />
            {!allTopics.length && (
              <p className="text-xs text-muted-foreground">
                Create a category and topic before adding articles.
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="article-title">Title</Label>
              <Input
                id="article-title"
                className="surface-input"
                value={articleForm.title}
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    title: event.target.value,
                    slug: current.slug || slugify(event.target.value),
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="article-slug">Slug</Label>
              <Input
                id="article-slug"
                className="surface-input"
                value={articleForm.slug}
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    slug: slugify(event.target.value),
                  }))
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="article-content">Markdown content</Label>
            <textarea
              id="article-content"
              className="min-h-48 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-foreground outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
              value={articleForm.content}
              onChange={(event) =>
                setArticleForm((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
              required
            />
          </div>
          <LoadingButton
            type="submit"
            loading={isLoading("article")}
            loadingLabel="Creating article..."
            disabled={!allTopics.length}
          >
            Create article
          </LoadingButton>
        </form>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <h3 className="font-semibold tracking-tight">Manage categories & topics</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a category and topic to publish settings or delete. Writer
          assignments are managed separately under Assign writers.
        </p>

        {categories.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
              <div className="space-y-2">
                <Label htmlFor="manage-category">Category</Label>
                <SelectField
                  id="manage-category"
                  value={manageCategoryId}
                  options={categoryOptions}
                  onValueChange={handleCategoryChange}
                  placeholder="Choose a category"
                />
              </div>

              <div className="space-y-2">
                <Label>Topic</Label>
                <div className="app-scrollbar max-h-56 overflow-y-auto rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
                  {!manageTopics.length ? (
                    <p className="px-2 py-3 text-sm text-muted-foreground">
                      No topics in this category.
                    </p>
                  ) : (
                    manageTopics.map((topic) => {
                      const isSelected = topic.id === manageTopicId;

                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setManageTopicId(topic.id)}
                          className={cn(
                            "flex w-full flex-col rounded-lg px-3 py-2.5 text-left transition-colors",
                            isSelected
                              ? "bg-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                          )}
                        >
                          <span className="truncate text-sm font-medium">
                            {topic.name}
                          </span>
                          <span className="mt-0.5 truncate text-xs opacity-80">
                            {topic.slug}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {manageTopics.length} topics — scroll to see all
                </p>
              </div>
            </div>

            {manageCategory && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">
                <p className="text-sm font-medium">{manageCategory.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  /notes/{manageCategory.slug} ·{" "}
                  {manageCategory.published ? "Published" : "Draft"} ·{" "}
                  {manageCategory.topicCount ?? manageTopics.length} topics
                </p>

                {manageTopic && (
                  <div className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
                    <div>
                      <p className="text-sm font-medium">{manageTopic.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {manageTopic.slug} ·{" "}
                        {manageTopic.published ? "Published" : "Draft"}
                        {manageTopic.openForAuthors ? " · Open for authors" : ""}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                        <input
                          type="checkbox"
                          className="mt-1 size-4 rounded border-white/20 accent-primary"
                          checked={manageTopic.openForAuthors}
                          disabled={isLoading(`topic-open-${manageTopic.id}`)}
                          onChange={(event) => {
                            const openForAuthors = event.target.checked;
                            submit(
                              `topic-open-${manageTopic.id}`,
                              () =>
                                notesApi.updateTopic(manageTopic.id, {
                                  openForAuthors,
                                }),
                              openForAuthors
                                ? "Topic opened for authors."
                                : "Topic closed for authors.",
                            );
                          }}
                        />
                        <span className="space-y-1">
                          <span className="block text-sm font-medium">
                            Open for authors
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            Required for Write → Available topics. Assign a writer
                            on the Assign writers page.
                          </span>
                        </span>
                      </label>

                      <label className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                        <input
                          type="checkbox"
                          className="mt-1 size-4 rounded border-white/20 accent-primary"
                          checked={manageTopic.published}
                          disabled={isLoading(`topic-published-${manageTopic.id}`)}
                          onChange={(event) => {
                            const published = event.target.checked;
                            submit(
                              `topic-published-${manageTopic.id}`,
                              () =>
                                notesApi.updateTopic(manageTopic.id, {
                                  published,
                                }),
                              published
                                ? "Topic marked published."
                                : "Topic marked draft.",
                            );
                          }}
                        />
                        <span className="space-y-1">
                          <span className="block text-sm font-medium">Published</span>
                          <span className="block text-xs text-muted-foreground">
                            Unpublished topics stay hidden from public Notes.
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <LoadingButton
                type="button"
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                loading={Boolean(
                  manageCategory && isLoading(`delete-category-${manageCategory.id}`),
                )}
                loadingLabel="Deleting category..."
                disabled={!manageCategory}
                onClick={handleDeleteCategory}
              >
                <Trash2 className="size-4" />
                Delete category
              </LoadingButton>

              <LoadingButton
                type="button"
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                loading={Boolean(
                  manageTopic && isLoading(`delete-topic-${manageTopic.id}`),
                )}
                loadingLabel="Deleting topic..."
                disabled={!manageTopic}
                onClick={handleDeleteTopic}
              >
                <Trash2 className="size-4" />
                Delete topic
              </LoadingButton>
            </div>

            {!manageTopic && manageCategory && manageTopics.length === 0 && (
              <p className="text-sm text-muted-foreground">
                This category has no topics yet. You can still delete the whole category.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
