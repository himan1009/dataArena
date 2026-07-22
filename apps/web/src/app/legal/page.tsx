import Link from "next/link";
import { FileText, Scale } from "lucide-react";

import { MarketingPageShell } from "@/components/legal/marketing-page-shell";
import { PageIntro } from "@/components/ui/page-intro";
import { legalPages } from "@/lib/legal-content";

export const metadata = {
  title: "Legal",
  description: "Privacy, terms, disclaimers, copyright, security, and cookie policies for DataArena.",
};

export default function LegalIndexPage() {
  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-3xl">
        <PageIntro
          icon={Scale}
          label="Legal"
          title="Policies & legal information"
          headingLevel="h1"
          description="These documents explain how DataArena handles personal data, platform rules, educational disclaimers, copyright and attribution, security practices, and cookies."
          className="mb-10"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {legalPages.map((page) => (
            <Link
              key={page.slug}
              href={`/legal/${page.slug}`}
              className="glass-panel group block p-6 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <h2 className="font-semibold tracking-tight group-hover:text-primary">
                    {page.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {page.description}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Updated {page.lastUpdated}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MarketingPageShell>
  );
}
