import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Files, Plus } from "lucide-react";

import { PracticeBreadcrumbs } from "@/components/practice/practice-breadcrumbs";
import { PracticeQuestionRow } from "@/components/practice/practice-question-row";
import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { canUploadPracticeQuestions, getCurrentUser } from "@/lib/auth-server";
import { getPracticeTopic, PracticeApiError } from "@/lib/practice-server";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ categorySlug: string; topicSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug, topicSlug } = await params;

  try {
    const data = await getPracticeTopic(categorySlug, topicSlug);
    return { title: `${data.topic.name} · Practice` };
  } catch {
    return { title: "Practice topic" };
  }
}

export default async function PracticeTopicPage({ params }: PageProps) {
  const { categorySlug, topicSlug } = await params;
  const user = await getCurrentUser();
  const canContribute = user ? canUploadPracticeQuestions(user) : false;

  let data;
  try {
    data = await getPracticeTopic(categorySlug, topicSlug);
  } catch (error) {
    if (error instanceof PracticeApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { topic } = data;

  return (
    <AppPage>
      <PracticeBreadcrumbs
        items={[
          { label: "Practice", href: "/practice" },
          { label: topic.category.name, href: `/practice/${topic.category.slug}` },
          { label: topic.name },
        ]}
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          icon={FileText}
          label={topic.category.name}
          title={topic.name}
          description={
            topic.description ??
            "Work through these questions in order. Open a link to solve on the original platform."
          }
        />
        {canContribute && (
          <Link
            href={`/practice/contribute?categoryId=${topic.category.id}&topicId=${topic.id}`}
            className={cn(buttonVariants(), "w-fit")}
          >
            <Plus className="size-4" />
            Add question
          </Link>
        )}
      </div>

      <section className="space-y-3">
        {topic.questions.length === 0 ? (
          <EmptyState
            icon={Files}
            title="No questions published yet"
            description="Questions for this topic will appear here after admin approval."
          />
        ) : (
          topic.questions.map((question, index) => (
            <PracticeQuestionRow key={question.id} question={question} index={index} />
          ))
        )}
      </section>
    </AppPage>
  );
}
