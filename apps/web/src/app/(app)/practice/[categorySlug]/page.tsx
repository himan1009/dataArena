import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FolderOpen } from "lucide-react";

import { PracticeBreadcrumbs } from "@/components/practice/practice-breadcrumbs";
import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { getPracticeCategory, PracticeApiError } from "@/lib/practice-server";

type PageProps = {
  params: Promise<{ categorySlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug } = await params;

  try {
    const data = await getPracticeCategory(categorySlug);
    return { title: `${data.category.name} · Practice` };
  } catch {
    return { title: "Practice category" };
  }
}

export default async function PracticeCategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;

  let data;
  try {
    data = await getPracticeCategory(categorySlug);
  } catch (error) {
    if (error instanceof PracticeApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { category } = data;

  return (
    <AppPage>
      <PracticeBreadcrumbs
        items={[
          { label: "Practice", href: "/practice" },
          { label: category.name },
        ]}
      />

      <PageIntro
        icon={FolderOpen}
        label={category.name}
        title="Topics"
        description={category.description ?? "Open a topic to see numbered questions."}
      />

      <section className="space-y-3">
        {category.topics.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No topics in this category"
            description="Topics will show up here once the admin team adds them."
          />
        ) : (
          category.topics.map((topic, index) => (
            <Link
              key={topic.id}
              href={`/practice/${category.slug}/${topic.slug}`}
              className="glass-panel glass-panel-hover group flex items-center justify-between gap-4 p-5 sm:p-6"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-xs font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold tracking-tight">{topic.name}</h3>
                  {topic.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {topic.questionCount}{" "}
                    {topic.questionCount === 1 ? "question" : "questions"}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))
        )}
      </section>
    </AppPage>
  );
}
