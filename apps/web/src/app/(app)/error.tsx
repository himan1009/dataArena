"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" />
      </div>
      <p className="section-label mt-6">Something went wrong</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Unable to load this page</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        An unexpected error occurred. Try again or return to your dashboard.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className={cn(buttonVariants())} onClick={reset}>
          Try again
        </button>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline" }), "border-white/10 bg-white/[0.02]")}
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
