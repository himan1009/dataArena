import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

import { Footer, Navbar } from "@/components/landing";
import { MeshBackground } from "@/components/ui/mesh-background";
import { PageContainer } from "@/components/ui/page-container";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth-server";
import { cn } from "@/lib/utils";

export default async function RootNotFound() {
  const user = await getCurrentUser();

  return (
    <>
      <MeshBackground />
      <Navbar user={user} />
      <main className="py-16 sm:py-20">
        <PageContainer size="narrow">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <FileQuestion className="size-6 text-primary" />
            </div>
            <p className="section-label mt-6">404</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              The page you are looking for does not exist or may have been moved.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={user ? "/dashboard" : "/"} className={cn(buttonVariants(), "gap-2")}>
                {user ? "Go to dashboard" : "Back to home"}
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "gap-2 border-white/10 bg-white/[0.02]",
                )}
              >
                <ArrowLeft className="size-4" />
                Sign in
              </Link>
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer user={user} />
    </>
  );
}
