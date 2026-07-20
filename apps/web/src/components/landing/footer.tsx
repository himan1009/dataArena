import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { PageContainer } from "@/components/ui/page-container";
import type { AuthUser } from "@/lib/api";

const footerLinks = [
  { href: "#features", label: "Features" },
  { href: "#principles", label: "Method" },
  { href: "#roadmap", label: "Roadmap" },
];

export function Footer({ user }: { user: AuthUser | null }) {
  return (
    <footer className="border-t border-border py-12">
      <PageContainer size="wide">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
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
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 hover:text-foreground"
                >
                  {link.label}
                </a>
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

        <p className="mt-10 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DataArena
        </p>
      </PageContainer>
    </footer>
  );
}
