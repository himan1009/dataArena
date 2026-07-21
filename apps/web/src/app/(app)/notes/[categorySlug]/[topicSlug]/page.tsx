import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FileText } from "lucide-react";

import { EditorAssignedBanner } from "@/components/notes/editor-assigned-banner";
import { NotesAdminEditLink } from "@/components/notes/notes-admin-edit-link";
import { NotesBreadcrumbs } from "@/components/notes/notes-breadcrumbs";
import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { getCurrentUser } from "@/lib/auth-server";
import { getTopic, NotesApiError } from "@/lib/notes-server";

type PageProps = {
  params: Promise<{ categorySlug: string; topicSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug, topicSlug } = await params;

  try {
    const topic = await getTopic(categorySlug, topicSlug);
    return { title: topic.name };
  } catch {
    return { title: "Topic" };
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { categorySlug, topicSlug } = await params;
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  let topic;
  try {
    topic = await getTopic(categorySlug, topicSlug);
  } catch (error) {
    if (error instanceof NotesApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="space-y-12 sm:space-y-14">
      <NotesBreadcrumbs
        items={[
          { label: "Notes", href: "/notes" },
          { label: topic.category.name, href: `/notes/${topic.category.slug}` },
          { label: topic.name },
        ]}
      />

      <div className="flex items-start gap-5">
        <IconBox icon={FileText} size="lg" className="hidden sm:flex" />
        <PageHeader
          label={topic.category.name}
          title={topic.name}
          description={topic.description ?? "Learning hub articles for this topic."}
        />
      </div>

      <Suspense fallback={null}>
        <EditorAssignedBanner />
      </Suspense>

      <section className="space-y-3">
        {topic.articles.map((article, index) => (
          <div
            key={article.id}
            className="glass-panel glass-panel-hover flex items-center justify-between gap-4 p-5 sm:p-6"
          >
            <Link
              href={`/notes/${categorySlug}/${topicSlug}/${article.slug}`}
              className="flex min-w-0 flex-1 items-center gap-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white/[0.02] text-xs font-medium text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold tracking-tight">{article.title}</h3>
                {article.updatedAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Updated {new Date(article.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
            {isAdmin && <NotesAdminEditLink articleId={article.id} />}
          </div>
        ))}
      </section>
    </div>
  );
}
