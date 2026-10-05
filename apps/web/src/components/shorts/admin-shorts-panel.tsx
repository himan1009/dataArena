"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { YouTubeShortPlayer } from "@/components/shorts/youtube-short-player";
import { slugify } from "@/lib/notes-utils";
import { ShortsApiError, shortsApi, type ShortTopic } from "@/lib/shorts-api";
import { extractYouTubeVideoId } from "@/lib/youtube-utils";

export function AdminShortsPanel({ topics }: { topics: ShortTopic[] }) {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [topicForm, setTopicForm] = useState({ name: "", slug: "" });
  const [subtopicForm, setSubtopicForm] = useState({
    topicId: topics[0]?.id ?? "",
    name: "",
    slug: "",
  });
  const [videoForm, setVideoForm] = useState({
    subtopicId: "",
    title: "",
    youtubeUrl: "",
  });

  useEffect(() => {
    if (!topics.length) return;
    if (!topics.some((t) => t.id === subtopicForm.topicId)) {
      setSubtopicForm((c) => ({ ...c, topicId: topics[0].id }));
    }
  }, [topics, subtopicForm.topicId]);

  const selectedTopic = useMemo(
    () => topics.find((t) => t.id === subtopicForm.topicId),
    [topics, subtopicForm.topicId],
  );

  const subtopicOptions =
    selectedTopic?.subtopics?.map((s) => ({ value: s.id, label: s.name })) ?? [];

  useEffect(() => {
    if (!subtopicOptions.length) {
      setVideoForm((c) => (c.subtopicId ? { ...c, subtopicId: "" } : c));
      return;
    }
    if (!subtopicOptions.some((o) => o.value === videoForm.subtopicId)) {
      setVideoForm((c) => ({ ...c, subtopicId: subtopicOptions[0].value }));
    }
  }, [subtopicOptions, videoForm.subtopicId]);

  const run = async (
    key: string,
    action: () => Promise<unknown>,
    onSuccess?: () => void,
  ) => {
    setError(null);
    setLoadingKey(key);
    try {
      await action();
      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof ShortsApiError ? err.message : "Action failed");
    } finally {
      setLoadingKey(null);
    }
  };

  const previewId = extractYouTubeVideoId(videoForm.youtubeUrl);

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="glass-panel space-y-4 p-6">
        <h2 className="text-lg font-semibold">Create topic</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={topicForm.name}
              onChange={(e) =>
                setTopicForm({
                  name: e.target.value,
                  slug: slugify(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={topicForm.slug}
              onChange={(e) => setTopicForm((c) => ({ ...c, slug: e.target.value }))}
            />
          </div>
        </div>
        <Button
          type="button"
          disabled={
            !topicForm.name.trim() ||
            !topicForm.slug.trim() ||
            loadingKey === "topic"
          }
          onClick={() =>
            run(
              "topic",
              () => shortsApi.adminCreateTopic(topicForm),
              () => setTopicForm({ name: "", slug: "" }),
            )
          }
        >
          {loadingKey === "topic" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add topic
        </Button>
      </section>

      <section className="glass-panel space-y-4 p-6">
        <h2 className="text-lg font-semibold">Create subtopic</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-1">
            <Label>Topic</Label>
            <SelectField
              value={subtopicForm.topicId}
              options={topics.map((t) => ({ value: t.id, label: t.name }))}
              onValueChange={(value) =>
                setSubtopicForm((c) => ({ ...c, topicId: value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={subtopicForm.name}
              onChange={(e) =>
                setSubtopicForm({
                  ...subtopicForm,
                  name: e.target.value,
                  slug: slugify(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={subtopicForm.slug}
              onChange={(e) =>
                setSubtopicForm((c) => ({ ...c, slug: e.target.value }))
              }
            />
          </div>
        </div>
        <Button
          type="button"
          disabled={
            !subtopicForm.topicId ||
            !subtopicForm.name.trim() ||
            !subtopicForm.slug.trim() ||
            loadingKey === "subtopic"
          }
          onClick={() =>
            run(
              "subtopic",
              () => shortsApi.adminCreateSubtopic(subtopicForm),
              () =>
                setSubtopicForm((c) => ({
                  ...c,
                  name: "",
                  slug: "",
                })),
            )
          }
        >
          {loadingKey === "subtopic" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add subtopic
        </Button>
      </section>

      <section className="glass-panel space-y-4 p-6">
        <h2 className="text-lg font-semibold">Add YouTube short</h2>
        <p className="text-sm text-muted-foreground">
          Paste a YouTube Shorts or watch URL. Videos play inside DataArena (embedded player).
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,280px)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subtopic</Label>
              <SelectField
                value={videoForm.subtopicId}
                options={subtopicOptions}
                onValueChange={(value) =>
                  setVideoForm((c) => ({ ...c, subtopicId: value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={videoForm.title}
                onChange={(e) => setVideoForm((c) => ({ ...c, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input
                value={videoForm.youtubeUrl}
                onChange={(e) =>
                  setVideoForm((c) => ({ ...c, youtubeUrl: e.target.value }))
                }
                placeholder="https://youtube.com/shorts/..."
              />
            </div>
            <Button
              type="button"
              disabled={
                !videoForm.subtopicId ||
                !videoForm.title.trim() ||
                !previewId ||
                loadingKey === "video"
              }
              onClick={() =>
                run(
                  "video",
                  () => shortsApi.adminCreateVideo(videoForm),
                  () =>
                    setVideoForm((c) => ({
                      ...c,
                      title: "",
                      youtubeUrl: "",
                    })),
                )
              }
            >
              {loadingKey === "video" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Publish short
            </Button>
          </div>
          {previewId && (
            <YouTubeShortPlayer videoId={previewId} title={videoForm.title || "Preview"} />
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Manage & delete</h2>
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No topics yet.</p>
        ) : (
          topics.map((topic) => (
            <div key={topic.id} className="glass-panel space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">/shorts/{topic.slug}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-destructive/30 text-destructive"
                  disabled={loadingKey === `del-topic-${topic.id}`}
                  onClick={() => {
                    if (!window.confirm(`Delete topic "${topic.name}"? Remove all videos first.`)) return;
                    void run(`del-topic-${topic.id}`, () => shortsApi.adminDeleteTopic(topic.id));
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {(topic.subtopics ?? []).map((subtopic) => (
                <div key={subtopic.id} className="rounded-xl border border-white/[0.06] p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{subtopic.name}</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      disabled={loadingKey === `del-sub-${subtopic.id}`}
                      onClick={() => {
                        if (!window.confirm(`Delete subtopic "${subtopic.name}"?`)) return;
                        void run(`del-sub-${subtopic.id}`, () =>
                          shortsApi.adminDeleteSubtopic(subtopic.id),
                        );
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(subtopic.videos ?? []).map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.02] px-3 py-2 text-sm"
                      >
                        <span className="truncate">{video.title}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="shrink-0 text-destructive"
                          disabled={loadingKey === `del-vid-${video.id}`}
                          onClick={() => {
                            if (!window.confirm(`Delete short "${video.title}"?`)) return;
                            void run(`del-vid-${video.id}`, () =>
                              shortsApi.adminDeleteVideo(video.id),
                            );
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
