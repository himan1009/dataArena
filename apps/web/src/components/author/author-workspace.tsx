"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, PenLine } from "lucide-react";

import { ArticleStatusBadge } from "@/components/notes/article-status-badge";
import { Button } from "@/components/ui/button";
import { ApiError, notesApi, type AvailableTopic, type MyArticle } from "@/lib/notes-api";
import { slugify } from "@/lib/notes-utils";

export function AuthorWorkspace({
  topics,
  articles,
}: {
  topics: AvailableTopic[];
  articles: MyArticle[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [startingTopicId, setStartingTopicId] = useState<string | null>(null);

  const startWriting = async (topic: AvailableTopic) => {
    setError(null);
    setStartingTopicId(topic.id);

    try {
      const slug = slugify(topic.name);
      const response = await notesApi.createArticle({
        topicId: topic.id,
        title: `${topic.name} Guide`,
        slug,
        content: `# ${topic.name}\n\nStart writing your article here...\n\n## Overview\n\nDescribe the key concepts.\n\n## Examples\n\nAdd code snippets and explanations.\n`,
      });

      const articleId = (response as { article: { id: string } }).article.id;
      router.push(`/write/${articleId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start article");
    } finally {
      setStartingTopicId(null);
    }
  };

  return (
    <div className="space-y-10">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section>
        <h3 className="text-lg font-semibold tracking-tight">Available topics</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a topic prepared by admin and start your article.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <div key={topic.id} className="glass-panel p-5">
              <p className="text-xs font-medium text-primary">{topic.category.name}</p>
              <h4 className="mt-1 font-semibold">{topic.name}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{topic.description}</p>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => startWriting(topic)}
                disabled={startingTopicId === topic.id}
              >
                {startingTopicId === topic.id ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <PenLine className="size-4" />
                    Start writing
                  </>
                )}
              </Button>
            </div>
          ))}
          {topics.length === 0 && (
            <div className="glass-panel p-6 text-sm text-muted-foreground sm:col-span-2">
              No open topics right now. Check back after admin adds more.
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold tracking-tight">My articles</h3>
        <div className="mt-5 space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="glass-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{article.title}</h4>
                  <ArticleStatusBadge status={article.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {article.topic.category.name} · {article.topic.name}
                </p>
                {article.reviewComment && (
                  <p className="mt-2 text-sm text-orange-300">
                    Admin feedback: {article.reviewComment}
                  </p>
                )}
              </div>
              {(article.status === "DRAFT" || article.status === "CHANGES_REQUESTED") && (
                <Link href={`/write/${article.id}`}>
                  <Button size="sm" variant="outline" className="border-white/10 bg-white/[0.03]">
                    Continue editing
                  </Button>
                </Link>
              )}
            </div>
          ))}
          {articles.length === 0 && (
            <div className="glass-panel p-6 text-sm text-muted-foreground">
              You have not started any articles yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
