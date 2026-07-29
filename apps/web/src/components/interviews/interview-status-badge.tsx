import { Badge } from "@/components/ui/badge";
import {
  experienceStatusLabels,
  type InterviewExperienceStatus,
} from "@/lib/interview-experiences-api";

const styles: Record<InterviewExperienceStatus, string> = {
  DRAFT: "bg-white/[0.06] text-muted-foreground",
  SUBMITTED: "bg-amber-500/12 text-amber-200",
  CHANGES_REQUESTED: "bg-orange-500/12 text-orange-200",
  PUBLISHED: "badge-live",
  REJECTED: "bg-destructive/12 text-destructive",
};

export function InterviewStatusBadge({
  status,
}: {
  status: InterviewExperienceStatus;
}) {
  return (
    <Badge className={styles[status]}>{experienceStatusLabels[status]}</Badge>
  );
}
