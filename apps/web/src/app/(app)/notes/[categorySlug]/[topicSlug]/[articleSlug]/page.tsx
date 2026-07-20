import { notFound } from "next/navigation";

import { AuthorCredit } from "@/components/notes/author-credit";
import { ArticleNav, MarkdownContent } from "@/components/notes/markdown-content";
import { NotesBreadcrumbs } from "@/components/notes/notes-breadcrumbs";
import { PageHeader } from "@/components/ui/section-header";
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
    <div className="space-y-8 sm:space-y-10">
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

      <PageHeader
        label={article.topic.name}
        title={article.title}
        description={`Last updated ${new Date(article.updatedAt).toLocaleDateString()}`}
      />

      <MarkdownContent content={article.content} />

      <AuthorCredit author={article.author} publishedAt={article.publishedAt} />

      <ArticleNav
        categorySlug={categorySlug}
        topicSlug={topicSlug}
        articles={article.topic.articles}
        currentSlug={article.slug}
      />
    </div>
  );
}
