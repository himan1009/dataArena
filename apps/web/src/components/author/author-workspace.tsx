"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, Loader2, PenLine, PencilLine, Trash2 } from "lucide-react";

import { ArticleStatusBadge } from "@/components/notes/article-status-badge";
import { RequestEditPanel } from "@/components/author/request-edit-panel";
import { Button } from "@/components/ui/button";
import { ApiError, notesApi, type AvailableTopic, type MyArticle } from "@/lib/notes-api";
import { slugify } from "@/lib/notes-utils";

export function AuthorWorkspace({
  topics,
  writtenBy,
  editedBy,
}: {
  topics: AvailableTopic[];
  writtenBy: MyArticle[];
  editedBy: MyArticle[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [startingTopicId, setStartingTopicId] = useState<string | null>(null);
  const [requestingArticleId, setRequestingArticleId] = useState<string | null>(null);
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);

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

  const deleteDraft = async (article: MyArticle) => {
    if (
      !window.confirm(
        `Delete draft "${article.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    setError(null);
    setDeletingArticleId(article.id);

    try {
      await notesApi.deleteAuthorArticle(article.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete draft");
    } finally {
      setDeletingArticleId(null);
    }
  };

  const renderArticleActions = (article: MyArticle, section: "written" | "edited") => {
    const canEdit = article.canEdit ?? (article.status === "DRAFT" || article.status === "CHANGES_REQUESTED");
    const canRequestEdit =
      section === "written" &&
      (article.status === "SUBMITTED" || article.status === "PUBLISHED") &&
      !article.editRequestedAt &&
      !article.isAssignedToMe;
    const editPending = Boolean(article.editRequestedAt);

    return (
      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <Link href={`/write/${article.id}`}>
            <Button size="sm" variant="outline" className="border-white/10 bg-white/[0.03]">
              <PenLine className="size-4" />
              {section === "edited" ? "Continue editing" : "Continue writing"}
            </Button>
          </Link>
        )}
        {!canEdit && (
          <Link href={`/write/${article.id}`}>
            <Button size="sm" variant="outline" className="border-white/10 bg-white/[0.03]">
              <Eye className="size-4" />
              View article
            </Button>
          </Link>
        )}
        {canRequestEdit && (
          <Button
            size="sm"
            onClick={() =>
              setRequestingArticleId(
                requestingArticleId === article.id ? null : article.id,
              )
            }
          >
            <PencilLine className="size-4" />
            Request edits
          </Button>
        )}
        {editPending && (
          <span className="inline-flex items-center rounded-full bg-violet/15 px-3 py-1 text-xs font-medium text-violet">
            Edit request pending
          </span>
        )}
        {section === "written" && article.status === "DRAFT" && (
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
            disabled={deletingArticleId === article.id}
            onClick={() => deleteDraft(article)}
          >
            {deletingArticleId === article.id ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Delete draft
          </Button>
        )}
      </div>
    );
  };

  const renderArticleCard = (article: MyArticle, section: "written" | "edited") => (
    <div key={article.id} className="space-y-4">
      <div className="glass-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{article.title}</h4>
            <ArticleStatusBadge status={article.status} />
            {article.isAssignedToMe && (
              <span className="rounded-full bg-teal/15 px-2.5 py-0.5 text-xs font-medium text-teal">
                Active assignment
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {article.topic.category.name} · {article.topic.name}
          </p>
          {section === "edited" && article.author && (
            <p className="mt-1 text-sm text-muted-foreground">
              Written by{" "}
              <span className="font-medium text-foreground">
                {article.author.name || article.author.email.split("@")[0]}
              </span>
            </p>
          )}
          {article.reviewComment && (
            <p className="mt-2 text-sm text-orange-300">
              Admin feedback: {article.reviewComment}
            </p>
          )}
          {section === "written" && article.editRequestedAt && article.editRequestNote && (
            <p className="mt-2 text-sm text-muted-foreground">
              Edit request: {article.editRequestNote}
            </p>
          )}
        </div>
        {renderArticleActions(article, section)}
      </div>

      {section === "written" && requestingArticleId === article.id && (
        <RequestEditPanel
          articleId={article.id}
          articleTitle={article.title}
          onCancel={() => setRequestingArticleId(null)}
          onSuccess={() => {
            setRequestingArticleId(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-10">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section>
        <h3 className="text-lg font-semibold tracking-tight">
          Written by you
          {writtenBy.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({writtenBy.length})
            </span>
          )}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your drafts and submissions appear first. Continue writing before picking
          new topics.
        </p>
        <div className="mt-5 space-y-3">
          {writtenBy.map((article) => renderArticleCard(article, "written"))}
          {writtenBy.length === 0 && (
            <div className="glass-panel p-6 text-sm text-muted-foreground">
              No drafts yet. When admin assigns you a topic, it will appear below
              under Available topics.
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold tracking-tight">Available topics</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Topics admin assigned to you. Only you can start writing these.
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
              No topics assigned to you yet. Ask admin to assign topics under Admin →
              Assign writers.
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold tracking-tight">
          Edited by you
          {editedBy.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({editedBy.length})
            </span>
          )}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Articles written by someone else that you were assigned to edit or have already edited.
        </p>
        <div className="mt-5 space-y-3">
          {editedBy.map((article) => renderArticleCard(article, "edited"))}
          {editedBy.length === 0 && (
            <div className="glass-panel p-6 text-sm text-muted-foreground">
              No team edit assignments yet. Admin can assign you from a published article.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
