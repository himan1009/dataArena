"use client";

import { useSearchParams } from "next/navigation";

export function EditorAssignedBanner() {
  const searchParams = useSearchParams();

  if (searchParams.get("editorAssigned") !== "1") {
    return null;
  }

  return (
    <div className="rounded-xl border border-teal/25 bg-teal/10 px-4 py-3 text-sm text-teal">
      Edit access granted. The assigned editor can now update this article from
      their Write workspace.
    </div>
  );
}
