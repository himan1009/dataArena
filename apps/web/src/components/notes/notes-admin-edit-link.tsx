import Link from "next/link";
import { PencilLine } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotesAdminEditLink({
  articleId,
  className,
}: {
  articleId: string;
  className?: string;
}) {
  return (
    <Link
      href={`/admin/notes/${articleId}/edit`}
      className={cn(
        buttonVariants({ size: "sm", variant: "outline" }),
        "relative z-10 shrink-0 border-white/10 bg-white/[0.03]",
        className,
      )}
    >
      <PencilLine className="size-4" />
      Edit
    </Link>
  );
}
