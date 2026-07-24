"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { useAsyncAction } from "@/hooks/use-async-action";
import { ApiError, notesApi, type AuthorSummary } from "@/lib/notes-api";
import { cn } from "@/lib/utils";

type AssignmentTopic = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  openForAuthors: boolean;
  assignedAuthorId: string | null;
  assignedAuthor: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

type AssignmentCategory = {
  id: string;
  name: string;
  slug: string;
  topics?: AssignmentTopic[];
  topicCount?: number;
};

type FilterMode = "all" | "unassigned" | "assigned";

export function AdminTopicAssignmentsPanel({
  categories,
}: {
  categories: AssignmentCategory[];
}) {
  const router = useRouter();
  const { run, isLoading } = useAsyncAction();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editors, setEditors] = useState<AuthorSummary[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    let cancelled = false;

    notesApi
      .getAdminEditors()
      .then((data) => {
        if (!cancelled) {
          setEditors(data.editors);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEditors([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategoryId("");
      return;
    }

    if (!categories.some((category) => category.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );

  const editorOptions = useMemo(
    () => [
      { value: "", label: "Unassigned" },
      ...editors.map((editor) => ({
        value: editor.id,
        label: editor.name || editor.email,
      })),
    ],
    [editors],
  );

  const visibleTopics = useMemo(() => {
    const topics = selectedCategory?.topics ?? [];
    const query = search.trim().toLowerCase();

    return topics.filter((topic) => {
      if (filter === "unassigned" && topic.assignedAuthorId) {
        return false;
      }
      if (filter === "assigned" && !topic.assignedAuthorId) {
        return false;
      }
      if (!query) {
        return true;
      }

      return (
        topic.name.toLowerCase().includes(query) ||
        topic.slug.toLowerCase().includes(query) ||
        topic.assignedAuthor?.name?.toLowerCase().includes(query) ||
        topic.assignedAuthor?.email.toLowerCase().includes(query)
      );
    });
  }, [filter, search, selectedCategory?.topics]);

  const stats = useMemo(() => {
    const topics = categories.flatMap((category) => category.topics ?? []);
    return {
      total: topics.length,
      assigned: topics.filter((topic) => topic.assignedAuthorId).length,
      unassigned: topics.filter((topic) => !topic.assignedAuthorId).length,
    };
  }, [categories]);

  const assignAuthor = async (topicId: string, authorId: string | null) => {
    setError(null);
    setMessage(null);

    try {
      await run(`assign-${topicId}`, () =>
        notesApi.assignTopicAuthor(topicId, authorId),
      );
      setMessage(
        authorId ? "Writer assigned." : "Assignment removed.",
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save assignment");
    }
  };

  const toggleOpenForAuthors = async (topic: AssignmentTopic, openForAuthors: boolean) => {
    setError(null);
    setMessage(null);

    try {
      await run(`open-${topic.id}`, () =>
        notesApi.updateTopic(topic.id, { openForAuthors }),
      );
      setMessage(
        openForAuthors ? "Topic opened for writing." : "Topic closed for writing.",
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update topic");
    }
  };

  if (!categories.length) {
    return (
      <div className="glass-panel p-6 text-sm text-muted-foreground">
        Create categories and topics first under Admin → Content management.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Total topics
          </p>
          <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Assigned
          </p>
          <p className="mt-1 text-2xl font-semibold text-teal">{stats.assigned}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Unassigned
          </p>
          <p className="mt-1 text-2xl font-semibold text-amber-200">
            {stats.unassigned}
          </p>
        </div>
      </div>

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

      <div className="glass-panel overflow-hidden">
        <div className="flex min-h-[32rem] flex-col lg:flex-row">
          <aside className="border-b border-white/[0.06] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
            <div className="border-b border-white/[0.06] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Categories
              </p>
            </div>
            <nav className="app-scrollbar max-h-48 overflow-y-auto p-2 lg:max-h-none lg:flex-1">
              {categories.map((category) => {
                const topicCount =
                  category.topicCount ?? category.topics?.length ?? 0;
                const assignedCount =
                  category.topics?.filter((topic) => topic.assignedAuthorId)
                    .length ?? 0;
                const isActive = category.id === selectedCategoryId;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={cn(
                      "flex w-full flex-col rounded-xl px-3 py-3 text-left transition-colors",
                      isActive
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                    )}
                  >
                    <span className="truncate text-sm font-medium">
                      {category.name}
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {assignedCount}/{topicCount} assigned
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="border-b border-white/[0.06] px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight">
                    {selectedCategory?.name ?? "Topics"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Assign one writer per topic. Only they can start writing it.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Input
                    className="surface-input sm:w-56"
                    placeholder="Search topics..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <SelectField
                    className="sm:w-44"
                    value={filter}
                    options={[
                      { value: "all", label: "All topics" },
                      { value: "unassigned", label: "Unassigned" },
                      { value: "assigned", label: "Assigned" },
                    ]}
                    onValueChange={(value) => setFilter(value as FilterMode)}
                  />
                </div>
              </div>
            </div>

            <div className="app-scrollbar max-h-[28rem] overflow-x-auto overflow-y-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
                  <tr className="border-b border-white/[0.06] text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3 font-semibold sm:px-6">Topic</th>
                    <th className="px-4 py-3 font-semibold sm:px-6">Status</th>
                    <th className="px-4 py-3 font-semibold sm:px-6">
                      Assigned writer
                    </th>
                    <th className="px-4 py-3 font-semibold sm:px-6">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTopics.map((topic) => {
                    const assignKey = `assign-${topic.id}`;
                    const openKey = `open-${topic.id}`;

                    return (
                      <tr
                        key={topic.id}
                        className="border-b border-white/[0.04] last:border-b-0"
                      >
                        <td className="px-4 py-4 sm:px-6">
                          <p className="font-medium">{topic.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {topic.slug}
                          </p>
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex flex-wrap gap-2">
                            {topic.published ? (
                              <Badge className="badge-live">Published</Badge>
                            ) : (
                              <Badge className="bg-white/[0.06] text-muted-foreground">
                                Draft
                              </Badge>
                            )}
                            {topic.assignedAuthor ? (
                              <Badge className="bg-teal/15 text-teal">
                                Assigned
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500/12 text-amber-200">
                                Needs writer
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <SelectField
                            className="min-w-[12rem]"
                            value={topic.assignedAuthorId ?? ""}
                            options={editorOptions}
                            disabled={isLoading(assignKey)}
                            onValueChange={(value) =>
                              assignAuthor(topic.id, value || null)
                            }
                            placeholder="Choose editor"
                          />
                          {isLoading(assignKey) && (
                            <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Loader2 className="size-3 animate-spin" />
                              Saving...
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="size-4 rounded border-white/20 accent-primary"
                              checked={topic.openForAuthors}
                              disabled={isLoading(openKey)}
                              onChange={(event) =>
                                toggleOpenForAuthors(topic, event.target.checked)
                              }
                            />
                            <span className="text-xs text-muted-foreground">
                              Open for authors
                            </span>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {visibleTopics.length === 0 && (
                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No topics match your search or filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
