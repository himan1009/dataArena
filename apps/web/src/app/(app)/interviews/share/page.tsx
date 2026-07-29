import { PenLine } from "lucide-react";

import { InterviewSubmissionWizard } from "@/components/interviews/interview-submission-wizard";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = {
  title: "Share interview experience",
};

export default function ShareInterviewExperiencePage() {
  return (
    <AppPage>
      <PageIntro
        icon={PenLine}
        label="Contribute"
        title="Share your interview experience"
        description="Complete each section, save a draft anytime, and submit when you are ready for admin review."
      />
      <InterviewSubmissionWizard />
    </AppPage>
  );
}
