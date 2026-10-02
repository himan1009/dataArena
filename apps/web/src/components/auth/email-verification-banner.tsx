"use client";

import Link from "next/link";
import { MailWarning } from "lucide-react";

export function EmailVerificationBanner({
  emailVerified,
}: {
  emailVerified?: boolean;
}) {
  if (emailVerified === true) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <MailWarning className="mt-0.5 size-4 shrink-0 text-amber-400" />
        <p className="text-sm text-foreground/90">
          Your email is not verified yet. Check your inbox or resend from{" "}
          <Link href="/settings" className="font-medium text-primary hover:underline">
            Settings
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
