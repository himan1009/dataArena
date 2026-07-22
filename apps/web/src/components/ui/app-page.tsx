import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const APP_PAGE_SPACING = "space-y-12 sm:space-y-14";

export function AppPage({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "full";
}) {
  return (
    <div
      className={cn(
        size === "full"
          ? "flex min-h-0 flex-1 flex-col gap-4"
          : APP_PAGE_SPACING,
        size === "narrow" && "mx-auto max-w-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
