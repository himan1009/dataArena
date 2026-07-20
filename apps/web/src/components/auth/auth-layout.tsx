import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { MeshBackground } from "@/components/ui/mesh-background";
import { IconBox } from "@/components/ui/icon-box";
import { BookOpen, Code2, Shield } from "lucide-react";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative flex min-h-screen">
      <MeshBackground variant="auth" />

      <div className="hidden w-[46%] flex-col justify-between border-r border-border p-12 xl:p-14 lg:flex">
        <Logo />
        <div className="max-w-md space-y-8">
          <div>
            <p className="section-label mb-4">DataArena</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Your workspace for{" "}
              <span className="gradient-text">data engineering</span>
            </h1>
          </div>
          <p className="prose-muted">
            Notes, practice labs, interview prep, and AI tools — structured
            the way engineers actually work.
          </p>
          <div className="space-y-3.5">
            {[
              { icon: BookOpen, text: "Structured notes and learning paths" },
              { icon: Code2, text: "Practice labs for SQL, Python, and Spark" },
              { icon: Shield, text: "Secure login with role-based access" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <IconBox icon={item.icon} size="sm" />
                <span className="text-sm text-foreground/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} DataArena
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-8 lg:w-[54%]">
        <div className="mb-8 w-full max-w-md lg:hidden">
          <Logo />
        </div>

        <div className="w-full max-w-md">
          <header className="mb-7 text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="prose-muted mt-2">{subtitle}</p>
          </header>

          <div className="glass-panel p-7 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({
  text,
  linkText,
  href,
}: {
  text: string;
  linkText: string;
  href: string;
}) {
  return (
    <p className="mt-6 text-center text-sm text-muted-foreground">
      {text}{" "}
      <Link href={href} className="font-medium text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
