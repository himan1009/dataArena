import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderOpen, Plus } from "lucide-react";

import { PracticeQuestionCard } from "@/components/practice/practice-question-card";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { canUploadPracticeQuestions, requireUser } from "@/lib/auth-server";
import { getMyPracticeQuestions } from "@/lib/practice-server";
import { questionStatusLabels, type PracticeQuestion, type PracticeQuestionStatus } from "@/lib/practice-api";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "My practice submissions",
};

const sections: Array<{
  key: PracticeQuestionStatus;
  title: string;
}> = [
  { key: "DRAFT", title: "Drafts" },
  { key: "SUBMITTED", title: "Pending review" },
  { key: "PUBLISHED", title: "Published" },
  { key: "REJECTED", title: "Rejected" },
];

function SectionList({
  title,
  items,
}: {
  title: string;
  items: PracticeQuestion[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length === 0 ? (
        <div className="glass-panel p-5 text-sm text-muted-foreground">None yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((question) => (
            <div key={question.id} className="space-y-3">
              <PracticeQuestionCard question={question} showStatus />
              {question.status && (
                <p className="text-xs text-muted-foreground">
                  {questionStatusLabels[question.status]}
                </p>
              )}
              {question.reviewComment && (
                <p className="text-sm text-orange-300">
                  Admin note: {question.reviewComment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function MyPracticeQuestionsPage() {
  const user = await requireUser();

  if (!canUploadPracticeQuestions(user)) {
    redirect("/practice");
  }

  const data = await getMyPracticeQuestions();

  const grouped = sections.reduce(
    (accumulator, section) => {
      accumulator[section.key] = data.questions.filter(
        (question) => question.status === section.key,
      );
      return accumulator;
    },
    {} as Record<PracticeQuestionStatus, PracticeQuestion[]>,
  );

  return (
    <AppPage>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          icon={FolderOpen}
          label="Your contributions"
          title="My practice submissions"
          description="Track drafts, pending reviews, and published questions."
        />
        <Link href="/practice/contribute" className={cn(buttonVariants(), "w-fit")}>
          <Plus className="size-4" />
          New question
        </Link>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <SectionList
            key={section.key}
            title={section.title}
            items={grouped[section.key] ?? []}
          />
        ))}
      </div>
    </AppPage>
  );
}
