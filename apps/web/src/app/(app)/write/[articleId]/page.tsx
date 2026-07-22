import { notFound } from "next/navigation";

import { ArticleEditor } from "@/components/author/article-editor";
import { requireEditor } from "@/lib/auth-server";
import { getCookieHeader } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";

type PageProps = {
  params: Promise<{ articleId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { articleId } = await params;

  try {
    await requireEditor();
    const cookieHeader = await getCookieHeader();

    const response = await fetch(getBackendUrl(`/notes/author/articles/${articleId}`), {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      return { title: `Edit: ${data.article.title}` };
    }
  } catch {
    // fall through
  }

  return { title: "Edit article" };
}

export default async function WriteArticlePage({ params }: PageProps) {
  await requireEditor();

  const { articleId } = await params;
  const cookieHeader = await getCookieHeader();

  const response = await fetch(getBackendUrl(`/notes/author/articles/${articleId}`), {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load article");
  }

  const data = await response.json();

  return <ArticleEditor article={data.article} />;
}
