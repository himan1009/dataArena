import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageContainer, Section } from "@/components/ui/page-container";
import { buttonVariants } from "@/components/ui/button";
import type { AuthUser } from "@/lib/api";
import { cn } from "@/lib/utils";

export function CTA({ user }: { user: AuthUser | null }) {
  return (
    <Section className="pb-24 pt-4">
      <PageContainer size="wide">
        <div className="rounded-2xl border border-gold/15 bg-gradient-to-br from-gold-muted via-card to-teal-muted p-10 text-center sm:p-14">
          <p className="section-label mb-4 justify-center">Get started</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {user ? "Your dashboard is ready" : "Start learning today"}
          </h2>
          <p className="mx-auto mt-4 max-w-lg prose-muted">
            {user
              ? "Your notes, articles, and progress are in your workspace."
              : "Free to join. Structured content from day one. Built for data engineers."}
          </p>
          <Link
            href={user ? "/dashboard" : "/register"}
            className={cn(buttonVariants({ size: "lg" }), "mt-8 gap-2")}
          >
            {user ? "Open dashboard" : "Create free account"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
