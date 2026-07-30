import { redirect } from "next/navigation";
import { PenLine } from "lucide-react";

import { PracticeQuestionForm } from "@/components/practice/practice-question-form";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { canUploadPracticeQuestions, requireUser } from "@/lib/auth-server";
import { getPracticeTaxonomy } from "@/lib/practice-server";

export const metadata = {
  title: "Contribute practice question",
};

export default async function PracticeContributePage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; topicId?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  if (!canUploadPracticeQuestions(user)) {
    redirect("/practice");
  }

  const taxonomy = await getPracticeTaxonomy();

  return (
    <AppPage>
      <PageIntro
        icon={PenLine}
        label="Practice"
        title="Add a practice question"
        description="Select category and topic, then add the question link. Approved questions appear in order on the topic page."
      />
      <PracticeQuestionForm
        categories={taxonomy.categories}
        defaultCategoryId={params.categoryId}
        defaultTopicId={params.topicId}
      />
    </AppPage>
  );
}
