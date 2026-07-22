import type { LucideIcon } from "lucide-react";

import { IconBox } from "@/components/ui/icon-box";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-14",
        className,
      )}
    >
      <IconBox icon={icon} size="lg" className="mb-5" />
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
