"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, notesApi } from "@/lib/notes-api";
import { slugify } from "@/lib/notes-utils";

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  published: boolean;
  sortOrder: number;
  topicCount?: number;
};

export function AdminNotesPanel({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "BookOpen",
  });

  const [topicForm, setTopicForm] = useState({
    categoryId: categories[0]?.id ?? "",
    name: "",
    slug: "",
    description: "",
  });

  const [articleForm, setArticleForm] = useState({
    topicId: "",
    title: "",
    slug: "",
    content: "# New article\n\nStart writing markdown here.",
  });

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      setError(err.message);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  const submit = async (key: string, action: () => Promise<unknown>) => {
    setMessage(null);
    setError(null);
    setIsSubmitting(key);

    try {
      await action();
      setMessage("Saved successfully.");
      router.refresh();
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(null);
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
            submit("category", () =>
              notesApi.createCategory({
                name: categoryForm.name,
                slug: categoryForm.slug || slugify(categoryForm.name),
                description: categoryForm.description || undefined,
                icon: categoryForm.icon || undefined,
              }),
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
            <Button type="submit" disabled={isSubmitting === "category"}>
              {isSubmitting === "category" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create category"
              )}
            </Button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <h3 className="font-semibold tracking-tight">Create topic</h3>
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            submit("topic", () =>
              notesApi.createTopic({
                categoryId: topicForm.categoryId,
                name: topicForm.name,
                slug: topicForm.slug || slugify(topicForm.name),
                description: topicForm.description || undefined,
              }),
            );
          }}
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="topic-category">Category</Label>
            <select
              id="topic-category"
              className="surface-input w-full rounded-xl px-3"
              value={topicForm.categoryId}
              onChange={(event) =>
                setTopicForm((current) => ({
                  ...current,
                  categoryId: event.target.value,
                }))
              }
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSubmitting === "topic" || !categories.length}>
              {isSubmitting === "topic" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create topic"
              )}
            </Button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <h3 className="font-semibold tracking-tight">Create article</h3>
        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit("article", () =>
              notesApi.createArticle({
                topicId: articleForm.topicId,
                title: articleForm.title,
                slug: articleForm.slug || slugify(articleForm.title),
                content: articleForm.content,
              }),
            );
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="article-topic-id">Topic ID</Label>
            <Input
              id="article-topic-id"
              className="surface-input"
              placeholder="Paste topic ID from database or future picker"
              value={articleForm.topicId}
              onChange={(event) =>
                setArticleForm((current) => ({
                  ...current,
                  topicId: event.target.value,
                }))
              }
              required
            />
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
          <Button type="submit" disabled={isSubmitting === "article"}>
            {isSubmitting === "article" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Create article"
            )}
          </Button>
        </form>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <h3 className="font-semibold tracking-tight">Existing categories</h3>
        <div className="mt-4 space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
            >
              <p className="font-medium">{category.name}</p>
              <p className="text-xs text-muted-foreground">
                /notes/{category.slug} · {category.published ? "Published" : "Draft"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
