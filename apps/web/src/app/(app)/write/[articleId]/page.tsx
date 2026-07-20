import { notFound, redirect } from "next/navigation";

import { ArticleEditor } from "@/components/author/article-editor";
import { PageHeader } from "@/components/ui/section-header";
import { requireUser } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";

type PageProps = {
  params: Promise<{ articleId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { articleId } = await params;
  return { title: `Edit article ${articleId}` };
}

export default async function WriteArticlePage({ params }: PageProps) {
  const user = await requireUser();

  if (user.role !== "EDITOR" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { articleId } = await params;
  const cookieStore = await import("next/headers").then((mod) => mod.cookies());
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

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

  return (
    <div className="space-y-8">
      <PageHeader label="Editor" title={data.article.title} />
      <ArticleEditor article={data.article} />
    </div>
  );
}
