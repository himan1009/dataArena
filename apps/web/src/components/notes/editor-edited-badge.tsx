import { PencilLine } from "lucide-react";

export function EditorEditedBadge({
  editorEditedAt,
  editorName,
  className,
}: {
  editorEditedAt?: string | null;
  editorName?: string | null;
  className?: string;
}) {
  if (!editorEditedAt) {
    return null;
  }

  const label = editorName ? `Edited by ${editorName}` : "Editor updated";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-2.5 py-0.5 text-xs font-medium text-teal ${className ?? ""}`}
      title={`${label} on ${new Date(editorEditedAt).toLocaleString()}`}
    >
      <PencilLine className="size-3.5" />
      {label}
    </span>
  );
}
