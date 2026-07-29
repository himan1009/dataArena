import { notFound } from "next/navigation";
import { PenLine } from "lucide-react";

import { InterviewSubmissionWizard } from "@/components/interviews/interview-submission-wizard";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { getCookieHeader } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";
import type { InterviewExperience } from "@/lib/interview-experiences-api";

async function getMine(id: string) {
  const cookieHeader = await getCookieHeader();
  const response = await fetch(getBackendUrl(`/interviews/mine/${id}`), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { experience: InterviewExperience };
  return data.experience;
}

export default async function EditInterviewExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getMine(id);

  if (!experience) {
    notFound();
  }

  if (
    experience.status !== "DRAFT" &&
    experience.status !== "CHANGES_REQUESTED"
  ) {
    notFound();
  }

  return (
    <AppPage>
      <PageIntro
        icon={PenLine}
        label="Edit submission"
        title={experience.title}
        description={
          experience.reviewComment
            ? `Admin feedback: ${experience.reviewComment}`
            : "Update your draft and submit again when ready."
        }
      />
      <InterviewSubmissionWizard initial={experience} />
    </AppPage>
  );
}
