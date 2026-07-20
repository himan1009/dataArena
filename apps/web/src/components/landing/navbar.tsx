import Link from "next/link";

import { UserMenu } from "@/components/auth/user-menu";
import { Logo } from "@/components/brand/logo";
import { PageContainer } from "@/components/ui/page-container";
import { buttonVariants } from "@/components/ui/button";
import type { AuthUser } from "@/lib/api";
import { cn } from "@/lib/utils";

const links = [
  { href: "#features", label: "Features" },
  { href: "#principles", label: "Method" },
  { href: "#roadmap", label: "Roadmap" },
];

export function Navbar({ user }: { user: AuthUser | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-background/80 backdrop-blur-xl">
      <PageContainer size="wide">
        <div className="flex h-[4.75rem] items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "hidden border-white/[0.1] bg-white/[0.02] sm:inline-flex",
                  )}
                >
                  Workspace
                </Link>
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "hidden text-muted-foreground sm:inline-flex",
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "sm" }), "px-5")}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
