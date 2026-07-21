import { notFound, redirect } from "next/navigation";

import { AdminArticleEditor } from "@/components/admin/admin-article-editor";
import { requireUser } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";

type PageProps = {
  params: Promise<{ articleId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { articleId } = await params;

  try {
    const user = await requireUser();
    if (user.role !== "ADMIN") {
      return { title: "Edit article" };
    }

    const cookieStore = await import("next/headers").then((mod) => mod.cookies());
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

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
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { articleId } = await params;
  const cookieStore = await import("next/headers").then((mod) => mod.cookies());
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

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
