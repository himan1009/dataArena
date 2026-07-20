import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const tintStyles = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  gold: "border-gold/25 bg-gold-muted text-gold",
  teal: "border-teal/25 bg-teal-muted text-teal",
  violet: "border-violet/25 bg-violet-muted text-violet",
} as const;

export function IconBox({
  icon: Icon,
  className,
  size = "md",
  tint = "primary",
}: {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
  tint?: keyof typeof tintStyles;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border",
        size === "sm" && "size-9",
        size === "md" && "size-10",
        size === "lg" && "size-12",
        tintStyles[tint],
        className,
      )}
    >
      <Icon
        className={cn(
          size === "sm" && "size-4",
          size === "md" && "size-4",
          size === "lg" && "size-5",
        )}
      />
    </div>
  );
}
