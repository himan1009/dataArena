import Link from "next/link";
import { ArrowUpRight, BookOpen, FolderOpen } from "lucide-react";

import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { PageIntro } from "@/components/ui/page-intro";
import { getCategories } from "@/lib/notes-server";
import { getCategoryIcon } from "@/lib/notes-utils";

export const metadata = {
  title: "Notes",
};

export default async function NotesPage() {
  const categories = await getCategories();

  return (
    <AppPage>
      <PageIntro
        icon={BookOpen}
        label="Knowledge Engine"
        title="Notes"
        description="Browse categories, topics, and articles written for data engineers."
      />

      <section className="grid gap-5 sm:grid-cols-2">
        {categories.length === 0 ? (
          <EmptyState
            className="sm:col-span-2"
            icon={FolderOpen}
            title="No categories yet"
            description="Learning categories will appear here once content is published by the admin team."
          />
        ) : (
          categories.map((category) => {
            const Icon = getCategoryIcon(category.icon);

            return (
              <Link
                key={category.id}
                href={`/notes/${category.slug}`}
                className="glass-panel glass-panel-hover group p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <IconBox icon={Icon} size="md" />
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{category.name}</h3>
                <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-4 meta-text">
                  {category.topicCount} {category.topicCount === 1 ? "topic" : "topics"}
                </p>
              </Link>
            );
          })
        )}
      </section>
    </AppPage>
  );
}
