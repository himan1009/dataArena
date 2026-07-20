import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { IconBox } from "@/components/ui/icon-box";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ComingSoon({
  icon: Icon,
  title,
  description,
  features,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-8 text-center">
      <IconBox icon={Icon} size="lg" className="mb-6" />

      <p className="section-label mb-3">Coming soon</p>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="prose-muted mt-3">{description}</p>

      {features && features.length > 0 && (
        <ul className="mt-8 w-full space-y-2 text-left">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 rounded-lg border border-border bg-white/[0.02] px-4 py-3 text-sm text-foreground/85"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/dashboard"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-8 gap-2 border-white/[0.1]",
        )}
      >
        Back to dashboard
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
