import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/[0.06]",
        className,
      )}
    />
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-12 sm:space-y-14" aria-busy="true" aria-label="Loading page">
      <div className="space-y-4">
        <Block className="h-4 w-28" />
        <Block className="h-9 w-full max-w-md" />
        <Block className="h-5 w-full max-w-2xl" />
      </div>

      <div className="glass-panel space-y-4 p-7 sm:p-8">
        <Block className="h-6 w-40" />
        <Block className="h-4 w-full max-w-xl" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Block className="h-28" />
          <Block className="h-28" />
        </div>
      </div>

      <div className="space-y-4">
        <Block className="h-6 w-48" />
        <Block className="h-4 w-full max-w-lg" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Block className="h-36" />
          <Block className="h-36" />
        </div>
      </div>
    </div>
  );
}
