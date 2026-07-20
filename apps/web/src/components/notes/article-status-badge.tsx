import { Badge } from "@/components/ui/badge";
import type { ArticleStatus } from "@/lib/notes-api";
import { statusLabels, statusStyles } from "@/lib/notes-api";
import { cn } from "@/lib/utils";

export function ArticleStatusBadge({
  status,
  className,
}: {
  status: ArticleStatus;
  className?: string;
}) {
  return (
    <Badge className={cn("border-0 px-2 py-0.5 text-[10px] font-semibold", statusStyles[status], className)}>
      {statusLabels[status]}
    </Badge>
  );
}
