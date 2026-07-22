import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FolderOpen } from "lucide-react";

import { NotesBreadcrumbs } from "@/components/notes/notes-breadcrumbs";
import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { getCategory, NotesApiError } from "@/lib/notes-server";
import { getCategoryIcon } from "@/lib/notes-utils";

type PageProps = {
  params: Promise<{ categorySlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug } = await params;

  try {
    const category = await getCategory(categorySlug);
    return { title: category.name };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;

  let category;
  try {
    category = await getCategory(categorySlug);
  } catch (error) {
    if (error instanceof NotesApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const Icon = getCategoryIcon(category.icon);

  return (
    <AppPage>
      <NotesBreadcrumbs
        items={[
          { label: "Notes", href: "/notes" },
          { label: category.name },
        ]}
      />

      <PageIntro
        icon={Icon}
        label={category.name}
        title="Topics"
        description={category.description ?? "Explore topics in this category."}
      />

      <section className="grid gap-5 sm:grid-cols-2">
        {category.topics.length === 0 ? (
          <EmptyState
            className="sm:col-span-2"
            icon={FolderOpen}
            title="No topics in this category"
            description="Topics will show up here once they are added and published."
          />
        ) : (
          category.topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/notes/${category.slug}/${topic.slug}`}
              className="glass-panel glass-panel-hover group p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{topic.name}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-4 meta-text">
                {topic.articleCount} {topic.articleCount === 1 ? "article" : "articles"}
              </p>
            </Link>
          ))
        )}
      </section>
    </AppPage>
  );
}
