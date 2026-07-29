import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";

import { InterviewStatusBadge } from "@/components/interviews/interview-status-badge";
import {
  levelLabels,
  resultLabels,
  roleLevelLabels,
  type InterviewExperience,
} from "@/lib/interview-experiences-api";

export function InterviewExperienceCard({
  experience,
  href,
  showStatus = false,
}: {
  experience: InterviewExperience;
  href: string;
  showStatus?: boolean;
}) {
  return (
    <Link href={href} className="glass-panel glass-panel-hover group block p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
              {experience.company}
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">
              {experience.title}
            </h3>
          </div>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>{experience.role}</span>
        <span>·</span>
        <span>
          {experience.yearsOfExperience
            ? `${experience.yearsOfExperience} years`
            : levelLabels[experience.experienceLevel]}
        </span>
        {experience.roleLevel && (
          <>
            <span>·</span>
            <span>{roleLevelLabels[experience.roleLevel]}</span>
          </>
        )}
        <span>·</span>
        <span>{experience.interviewYear}</span>
        <span>·</span>
        <span>{resultLabels[experience.result]}</span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
        {experience.overview}
      </p>

      {showStatus && (
        <div className="mt-4">
          <InterviewStatusBadge status={experience.status} />
        </div>
      )}
    </Link>
  );
}
