import Link from "next/link";
import {
  ArrowUpRight,
  Cookie,
  Copyright,
  FileText,
  Scale,
  Shield,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PageContainer, Section } from "@/components/ui/page-container";
import { buttonVariants } from "@/components/ui/button";
import { legalPages } from "@/lib/legal-content";
import { cn } from "@/lib/utils";

const policyMeta: Record<
  string,
  { icon: LucideIcon; accent: string; iconClass: string }
> = {
  privacy: {
    icon: Shield,
    accent: "border-primary/20 bg-primary/[0.06]",
    iconClass: "text-primary",
  },
  terms: {
    icon: FileText,
    accent: "border-gold/20 bg-gold-muted",
    iconClass: "text-gold",
  },
  disclaimer: {
    icon: Scale,
    accent: "border-teal/20 bg-teal-muted",
    iconClass: "text-teal",
  },
  copyright: {
    icon: Copyright,
    accent: "border-violet-500/20 bg-violet-500/[0.06]",
    iconClass: "text-violet-400",
  },
  security: {
    icon: ShieldCheck,
    accent: "border-white/[0.1] bg-white/[0.03]",
    iconClass: "text-foreground",
  },
  cookies: {
    icon: Cookie,
    accent: "border-white/[0.1] bg-white/[0.03]",
    iconClass: "text-muted-foreground",
  },
};

export function LegalNotice() {
  const year = new Date().getFullYear();

  return (
    <Section id="legal" className="border-t border-border py-16 sm:py-20">
      <PageContainer size="wide">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/[0.08]">
            <Shield className="size-5 text-primary" />
          </div>
          <p className="section-label justify-center">Trust & compliance</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Your data. Your rights. Clearly explained.
          </h2>
          <p className="prose-muted mx-auto mt-4 max-w-2xl">
            DataArena is an educational platform. Before you sign up or publish content,
            review how we handle your information, attribution, and platform rules.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/legal/privacy" className={cn(buttonVariants({ size: "lg" }), "min-w-[180px]")}>
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "min-w-[180px] border-white/[0.1] bg-transparent",
              )}
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {legalPages.map((page) => {
            const meta = policyMeta[page.slug] ?? policyMeta.security;
            const Icon = meta.icon;

            return (
              <Link
                key={page.slug}
                href={`/legal/${page.slug}`}
                className="glass-panel glass-panel-hover group flex h-full flex-col p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                      meta.accent,
                    )}
                  >
                    <Icon className={cn("size-4", meta.iconClass)} />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h3 className="mt-5 text-base font-semibold">{page.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {page.description}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Updated {page.lastUpdated}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Educational content is for learning only — not professional or employment advice.
          </p>
          <Link
            href="/legal"
            className="shrink-0 text-sm font-medium text-primary hover:text-primary/80"
          >
            View all policies
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {year} DataArena. All rights reserved.
        </p>
      </PageContainer>
    </Section>
  );
}
