import Link from "next/link";
import { Shield } from "lucide-react";

import { PageContainer, Section } from "@/components/ui/page-container";
import { legalNavLinks } from "@/lib/legal-content";

export function LegalNotice() {
  return (
    <Section className="py-16 sm:py-20">
      <PageContainer size="wide">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                  <Shield className="size-4 text-primary" />
                </div>
                <p className="section-label mb-0">Trust & compliance</p>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Policies, security, and legal information
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
                DataArena is an educational platform for data engineering learners and
                contributors. Before you create an account, publish content, or rely on
                any article or note, please read our legal documents. They explain how we
                handle your data, what you can expect from the platform, how author and
                editor attribution works, and the limits of educational content.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
                These policies are written to be practical and readable, not hidden in
                generic legal boilerplate. If anything is unclear, contact us before using
                the service in a way that depends on legal certainty.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[22rem]">
              {legalNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-foreground/90 transition-colors hover:bg-white/[0.05] hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-3 border-t border-white/[0.06] pt-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Educational content is provided for learning purposes only and does not
              constitute professional, legal, financial, or employment advice. Published
              articles may include author and editor attribution snapshots so credit remains
              visible over time.
            </p>
            <p>
              Use of DataArena is subject to our{" "}
              <Link href="/legal/terms" className="text-primary hover:text-primary/80">
                Terms of Service
              </Link>
              ,{" "}
              <Link href="/legal/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>
              , and{" "}
              <Link href="/legal/disclaimer" className="text-primary hover:text-primary/80">
                Disclaimer
              </Link>
              . © {new Date().getFullYear()} DataArena. All rights reserved.
            </p>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
