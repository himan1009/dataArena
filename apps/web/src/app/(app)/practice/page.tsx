import Link from "next/link";
import { ArrowUpRight, Code2, FolderOpen, Plus } from "lucide-react";

import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { canUploadPracticeQuestions, getCurrentUser } from "@/lib/auth-server";
import { getPracticeCategories } from "@/lib/practice-server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Practice",
};

export default async function PracticePage() {
  const [user, categoriesData] = await Promise.all([
    getCurrentUser(),
    getPracticeCategories(),
  ]);
  const canContribute = user ? canUploadPracticeQuestions(user) : false;
  const categories = categoriesData.categories;

  return (
    <AppPage>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          icon={Code2}
          label="Practice"
          title="Practice"
          description="Pick a category, open a topic, and work through curated questions in order."
        />
        {canContribute && (
          <div className="flex flex-wrap gap-3">
            <Link href="/practice/my" className={cn(buttonVariants({ variant: "outline" }))}>
              My submissions
            </Link>
            <Link href="/practice/contribute" className={cn(buttonVariants())}>
              <Plus className="size-4" />
              Add question
            </Link>
          </div>
        )}
      </div>

      <section className="grid gap-5 sm:grid-cols-2">
        {categories.length === 0 ? (
          <EmptyState
            className="sm:col-span-2"
            icon={FolderOpen}
            title="No practice categories yet"
            description="Categories like SQL and DSA will appear here once the admin team sets them up."
          />
        ) : (
          categories.map((category) => {
            const topicCount = category.topics?.length ?? 0;
            const questionCount = category._count?.questions ?? 0;

            return (
              <Link
                key={category.id}
                href={`/practice/${category.slug}`}
                className="glass-panel glass-panel-hover group p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <IconBox icon={Code2} size="md" tint="violet" />
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{category.name}</h3>
                {category.description && (
                  <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                    {category.description}
                  </p>
                )}
                <p className="mt-4 meta-text">
                  {topicCount} {topicCount === 1 ? "topic" : "topics"} · {questionCount}{" "}
                  {questionCount === 1 ? "question" : "questions"}
                </p>
              </Link>
            );
          })
        )}
      </section>
    </AppPage>
  );
}
