import Link from "next/link";
import { ArrowRight, BookOpen, type LucideIcon } from "lucide-react";

import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ComingSoonPage({
  icon,
  label = "Coming soon",
  title,
  description,
  features,
}: {
  icon: LucideIcon;
  label?: string;
  title: string;
  description: string;
  features?: string[];
}) {
  return (
    <AppPage>
      <PageIntro icon={icon} label={label} title={title} description={description} />

      <div className="glass-panel mx-auto max-w-2xl p-8 sm:p-10">
        {features && features.length > 0 && (
          <ul className="space-y-2">
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

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/notes" className={cn(buttonVariants(), "gap-2")}>
            <BookOpen className="size-4" />
            Browse notes
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-2 border-white/[0.1]",
            )}
          >
            Dashboard
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </AppPage>
  );
}
