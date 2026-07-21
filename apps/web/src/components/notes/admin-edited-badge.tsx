import { ShieldCheck } from "lucide-react";

export function AdminEditedBadge({
  adminEditedAt,
  className,
}: {
  adminEditedAt?: string | null;
  className?: string;
}) {
  if (!adminEditedAt) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold ${className ?? ""}`}
      title={`Admin last edited ${new Date(adminEditedAt).toLocaleString()}`}
    >
      <ShieldCheck className="size-3.5" />
      Admin edited
    </span>
  );
}
