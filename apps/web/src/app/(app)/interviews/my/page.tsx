import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";

import { InterviewStatusBadge } from "@/components/interviews/interview-status-badge";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { getMyExperiences } from "@/lib/interviews-server";
import { experienceStatusLabels, type InterviewExperience } from "@/lib/interview-experiences-api";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "My interview submissions",
};

const sections: Array<{
  key: keyof Awaited<ReturnType<typeof getMyExperiences>>["grouped"];
  title: string;
}> = [
  { key: "drafts", title: "My drafts" },
  { key: "pendingReview", title: "Pending review" },
  { key: "needsChanges", title: "Needs changes" },
  { key: "published", title: "Published" },
  { key: "rejected", title: "Rejected" },
];

function SectionList({
  title,
  items,
}: {
  title: string;
  items: InterviewExperience[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length === 0 ? (
        <div className="glass-panel p-5 text-sm text-muted-foreground">None yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((experience) => (
            <div key={experience.id} className="glass-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{experience.title}</h3>
                  <InterviewStatusBadge status={experience.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {experience.company} · {experience.role} · Updated{" "}
                  {new Date(experience.updatedAt).toLocaleDateString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {experienceStatusLabels[experience.status]}
                </p>
                {experience.reviewComment && (
                  <p className="mt-2 text-sm text-orange-300">
                    Admin note: {experience.reviewComment}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(experience.status === "DRAFT" ||
                  experience.status === "CHANGES_REQUESTED") && (
                  <Link
                    href={`/interviews/share/${experience.id}`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    Continue editing
                  </Link>
                )}
                {experience.status === "PUBLISHED" && (
                  <Link
                    href={`/interviews/${experience.slug}`}
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                  >
                    View live
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function MyInterviewExperiencesPage() {
  const data = await getMyExperiences();

  return (
    <AppPage>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          icon={FolderOpen}
          label="Your contributions"
          title="My interview submissions"
          description="Track drafts, pending reviews, and published experiences. You will see admin feedback when changes are requested."
        />
        <Link href="/interviews/share" className={cn(buttonVariants(), "w-fit")}>
          <Plus className="size-4" />
          New submission
        </Link>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <SectionList
            key={section.key}
            title={section.title}
            items={data.grouped[section.key] ?? []}
          />
        ))}
      </div>
    </AppPage>
  );
}
