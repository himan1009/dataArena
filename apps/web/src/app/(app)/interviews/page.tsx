import { Suspense } from "react";
import Link from "next/link";
import { Briefcase, PenLine, Plus } from "lucide-react";

import { InterviewExperienceCard } from "@/components/interviews/interview-experience-card";
import { InterviewBrowseFilters } from "@/components/interviews/interview-browse-filters";
import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedExperiences } from "@/lib/interviews-server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Interview Experiences",
};

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    company?: string;
    role?: string;
    experienceLevel?: string;
    roleLevel?: string;
  }>;
}) {
  const params = await searchParams;
  const data = await getPublishedExperiences(params);

  return (
    <AppPage>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          icon={Briefcase}
          label="Interview prep"
          title="Interview experiences"
          description="Real interview stories from the community — reviewed by the Data Arena team before publishing."
        />
        <div className="flex flex-wrap gap-3">
          <Link href="/interviews/my" className={cn(buttonVariants({ variant: "outline" }))}>
            My submissions
          </Link>
          <Link href="/interviews/share" className={cn(buttonVariants())}>
            <Plus className="size-4" />
            Share experience
          </Link>
        </div>
      </div>

      <Suspense fallback={<div className="glass-panel h-28 animate-pulse" />}>
        <InterviewBrowseFilters companies={data.companies} roles={data.roles} />
      </Suspense>

      <section className="grid gap-5 sm:grid-cols-2">
        {data.experiences.length === 0 ? (
          <EmptyState
            className="sm:col-span-2"
            icon={PenLine}
            title="No published experiences yet"
            description="Be the first to share your interview story. Submissions are reviewed before going live."
          />
        ) : (
          data.experiences.map((experience) => (
            <InterviewExperienceCard
              key={experience.id}
              experience={experience}
              href={`/interviews/${experience.slug}`}
            />
          ))
        )}
      </section>
    </AppPage>
  );
}
