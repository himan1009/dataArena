import type { LucideIcon } from "lucide-react";

import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

export function PageIntro({
  icon,
  label,
  title,
  description,
  className,
  headingLevel = "h2",
}: {
  icon: LucideIcon;
  label?: string;
  title: string;
  description?: string;
  className?: string;
  headingLevel?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex items-start gap-5", className)}>
      <IconBox icon={icon} size="lg" className="hidden sm:flex" />
      <PageHeader
        label={label}
        title={title}
        description={description}
        className="mb-0 sm:mb-0"
        as={headingLevel}
      />
    </div>
  );
}
