import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { PageContainer } from "@/components/ui/page-container";
import { legalNavLinks } from "@/lib/legal-content";
import type { AuthUser } from "@/lib/api";

const productLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#principles", label: "Method" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/contact", label: "Contact" },
  { href: "/report-bug", label: "Report a bug" },
];

export function Footer({ user }: { user: AuthUser | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <PageContainer size="wide">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Notes, practice, interviews, and AI for data engineers —
              in one platform.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Product
            </p>
            <div className="mt-3 flex flex-col gap-2.5">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Legal
            </p>
            <div className="mt-3 flex flex-col gap-2.5">
              <Link
                href="/legal"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                All policies
              </Link>
              {legalNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Account
            </p>
            <div className="mt-3 flex flex-col gap-2.5 text-sm">
              {user ? (
                <Link href="/dashboard" className="text-primary hover:text-primary/80">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-foreground/80 hover:text-foreground">
                    Sign in
                  </Link>
                  <Link href="/register" className="text-primary hover:text-primary/80">
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-3 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            Educational content is for learning purposes only. See our{" "}
            <Link href="/legal/disclaimer" className="text-primary hover:text-primary/80">
              Disclaimer
            </Link>
            .
          </p>
          <p>© {year} DataArena. All rights reserved.</p>
        </div>
      </PageContainer>
    </footer>
  );
}
