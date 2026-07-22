import type { LucideIcon } from "lucide-react";

import { IconBox } from "@/components/ui/icon-box";
import { cn } from "@/lib/utils";

export function SectionHeading({
  icon,
  title,
  description,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      {icon && <IconBox icon={icon} size="sm" className="mt-0.5" />}
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
