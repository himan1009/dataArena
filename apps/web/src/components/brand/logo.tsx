import Link from "next/link";
import { Database } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  showTagline = false,
  href = "/",
}: {
  className?: string;
  showTagline?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-3", className)}>
      <div className="flex size-9 items-center justify-center rounded-lg border border-gold/25 bg-gradient-to-br from-gold-muted to-primary/10 transition-colors group-hover:border-gold/40">
        <Database className="size-4 text-gold" />
      </div>
      <div className="min-w-0">
        <p className="text-base font-semibold tracking-tight">DataArena</p>
        {showTagline && (
          <p className="text-xs text-muted-foreground">Data engineering platform</p>
        )}
      </div>
    </Link>
  );
}
