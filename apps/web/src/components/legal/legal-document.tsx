import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { LegalPage } from "@/lib/legal-content";
import { legalNavLinks } from "@/lib/legal-content";

function slugifySection(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <article className="mx-auto max-w-4xl">
      <Link
        href="/legal"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All policies
      </Link>

      <header className="mb-10">
        <p className="section-label">Legal</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{page.title}</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted-foreground">
          {page.description}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: {page.lastUpdated}</p>
      </header>

      <div className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm font-semibold tracking-tight">On this page</p>
        <nav className="mt-4 grid gap-2 sm:grid-cols-2">
          {page.sections.map((section) => (
            <a
              key={section.title}
              href={`#${slugifySection(section.title)}`}
              className="text-sm leading-relaxed text-muted-foreground transition-colors hover:text-primary"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </div>

      <div className="glass-panel space-y-12 p-6 sm:p-10">
        {page.sections.map((section) => (
          <section
            key={section.title}
            id={slugifySection(section.title)}
            className="scroll-mt-28"
          >
            <h2 className="text-xl font-semibold tracking-tight sm:text-[1.35rem]">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-8 text-muted-foreground">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="space-y-3 pl-5">
                  {section.bullets.map((item) => (
                    <li key={item} className="list-disc marker:text-primary/70">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <aside className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm font-semibold tracking-tight">Related policies</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          These documents work together. We recommend reading the Privacy Policy and Terms
          of Service before using the platform, and reviewing the Disclaimer before relying
          on educational content.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {legalNavLinks
            .filter((link) => !link.href.endsWith(page.slug))
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-primary hover:text-primary/80"
              >
                {link.label}
              </Link>
            ))}
        </div>
      </aside>
    </article>
  );
}
