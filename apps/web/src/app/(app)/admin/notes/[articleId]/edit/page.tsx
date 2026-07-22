import { notFound } from "next/navigation";

import { AdminArticleEditor } from "@/components/admin/admin-article-editor";
import { getCookieHeader, requireAdmin } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";

type PageProps = {
  params: Promise<{ articleId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { articleId } = await params;

  try {
    await requireAdmin();
    const cookieHeader = await getCookieHeader();

    const response = await fetch(getBackendUrl(`/notes/admin/articles/${articleId}`), {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      return { title: `Admin edit: ${data.article.title}` };
    }
  } catch {
    // fall through
  }

  return { title: "Edit article" };
}

export default async function AdminEditArticlePage({ params }: PageProps) {
  await requireAdmin();

  const { articleId } = await params;
  const cookieHeader = await getCookieHeader();

  const response = await fetch(getBackendUrl(`/notes/admin/articles/${articleId}`), {
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

  return <AdminArticleEditor article={data.article} />;
}
