import { notFound } from "next/navigation";

import { ArticleContributors } from "@/components/notes/article-contributors";
import { AdminEditedBadge } from "@/components/notes/admin-edited-badge";
import { EditorEditedBadge } from "@/components/notes/editor-edited-badge";
import { ArticleNav, MarkdownContent } from "@/components/notes/markdown-content";
import { NotesAdminAssignEditor } from "@/components/notes/notes-admin-assign-editor";
import { NotesAdminEditLink } from "@/components/notes/notes-admin-edit-link";
import { NotesBreadcrumbs } from "@/components/notes/notes-breadcrumbs";
import { getCurrentUser } from "@/lib/auth-server";
import { getArticle, NotesApiError } from "@/lib/notes-server";

type PageProps = {
  params: Promise<{
    categorySlug: string;
    topicSlug: string;
    articleSlug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug, topicSlug, articleSlug } = await params;

  try {
    const article = await getArticle(categorySlug, topicSlug, articleSlug);
    return { title: article.title };
  } catch {
    return { title: "Article" };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { categorySlug, topicSlug, articleSlug } = await params;
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  let article;
  try {
    article = await getArticle(categorySlug, topicSlug, articleSlug);
  } catch (error) {
    if (error instanceof NotesApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <article className="w-full space-y-8 sm:space-y-10">
      <header className="space-y-5 border-b border-border pb-8 sm:pb-10">
        <NotesBreadcrumbs
          items={[
            { label: "Notes", href: "/notes" },
            {
              label: article.topic.category.name,
              href: `/notes/${article.topic.category.slug}`,
            },
            {
              label: article.topic.name,
              href: `/notes/${categorySlug}/${topicSlug}`,
            },
            { label: article.title },
          ]}
        />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="section-label">{article.topic.name}</p>
            <h1 className="max-w-5xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated {new Date(article.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <AdminEditedBadge adminEditedAt={article.adminEditedAt} />
              <EditorEditedBadge
                editorEditedAt={article.editorEditedAt}
                editorName={
                  article.lastEditor?.name || article.lastEditorNameSnapshot
                }
              />
            </div>
          </div>
          {isAdmin && (
            <div className="flex flex-col items-end gap-3">
              <div className="flex flex-wrap justify-end gap-2">
                <NotesAdminAssignEditor
                  articleId={article.id}
                  articleTitle={article.title}
                  topicHref={`/notes/${categorySlug}/${topicSlug}`}
                />
                <NotesAdminEditLink articleId={article.id} />
              </div>
            </div>
          )}
        </div>
      </header>

      <MarkdownContent content={article.content} variant="reading" />

      <div className="border-t border-border pt-8">
        <ArticleContributors
          author={article.author}
          publishedAt={article.publishedAt}
          lastEditor={article.lastEditor}
          editorEditedAt={article.editorEditedAt}
          lastEditorNameSnapshot={article.lastEditorNameSnapshot}
        />
      </div>

      <ArticleNav
        categorySlug={categorySlug}
        topicSlug={topicSlug}
        articles={article.topic.articles}
        currentSlug={article.slug}
      />
    </article>
  );
}
