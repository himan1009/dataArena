import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { InterviewExperienceCard } from "@/components/interviews/interview-experience-card";
import { InterviewExperienceDetail } from "@/components/interviews/interview-experience-detail";
import { InterviewReportForm } from "@/components/interviews/interview-report-form";
import { AppPage } from "@/components/ui/app-page";
import { buttonVariants } from "@/components/ui/button";
import { getExperienceBySlug } from "@/lib/interviews-server";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const data = await getExperienceBySlug(slug);
    return { title: data.experience.title };
  } catch {
    return { title: "Interview experience" };
  }
}

export default async function InterviewExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let data;
  try {
    data = await getExperienceBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <AppPage>
      <Link
        href="/interviews"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
      >
        <ArrowLeft className="size-4" />
        Back to experiences
      </Link>

      <InterviewExperienceDetail experience={data.experience} />

      <InterviewReportForm slug={data.experience.slug} />

      {data.related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Related experiences</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {data.related.map((experience) => (
              <InterviewExperienceCard
                key={experience.id}
                experience={experience}
                href={`/interviews/${experience.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </AppPage>
  );
}
