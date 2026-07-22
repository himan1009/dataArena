import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
        <FileQuestion className="size-6 text-primary" />
      </div>
      <p className="section-label mt-6">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard" className={cn(buttonVariants(), "gap-2")}>
          Go to dashboard
        </Link>
        <Link
          href="/notes"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "gap-2 border-white/10 bg-white/[0.02]",
          )}
        >
          <ArrowLeft className="size-4" />
          Browse notes
        </Link>
      </div>
    </div>
  );
}
