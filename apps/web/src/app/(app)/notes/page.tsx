import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { getCategories } from "@/lib/notes-server";
import { getCategoryIcon } from "@/lib/notes-utils";

export const metadata = {
  title: "Notes",
};

export default async function NotesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-12 sm:space-y-14">
      <div className="flex items-start gap-5">
        <IconBox icon={BookOpen} size="lg" className="hidden sm:flex" />
        <PageHeader
          label="Knowledge Engine"
          title="Notes"
          description="Browse categories, topics, and articles written for data engineers."
        />
      </div>

      <section className="grid gap-5 sm:grid-cols-2">
        {categories.map((category) => {
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
        })}
      </section>
    </div>
  );
}
