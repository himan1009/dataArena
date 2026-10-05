import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ShortsBreadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="size-3.5 opacity-60" />}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
