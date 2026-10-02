"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiError, authApi } from "@/lib/api";

const DISMISS_KEY = "dataarena_email_verify_dismissed";

export function EmailVerificationPrompt({
  email,
  emailVerified,
}: {
  email: string;
  emailVerified?: boolean;
}) {
  const router = useRouter();
  const needsVerification = emailVerified !== true;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!needsVerification) {
      setOpen(false);
      return;
    }

    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    setOpen(!dismissed);
  }, [needsVerification]);

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await authApi.resendVerification();
      setFeedback(response.message);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send email");
    } finally {
      setLoading(false);
    }
  };

  const handleLater = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  };

  if (!needsVerification || !open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-email-title"
    >
      <div className="glass-panel w-full max-w-md p-6 sm:p-7">
        <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
          <MailCheck className="size-5 text-primary" />
        </div>
        <h2 id="verify-email-title" className="text-xl font-semibold tracking-tight">
          Verify your email
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Please confirm{" "}
          <span className="font-medium text-foreground">{email}</span> belongs to you.
          Check your inbox for the link, or tap resend below.
        </p>

        {feedback && (
          <p className="mt-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
            {feedback}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="flex-1"
            disabled={loading}
            onClick={() => void handleResend()}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-white/[0.1]"
            onClick={handleLater}
          >
            Remind me later
          </Button>
        </div>
      </div>
    </div>
  );
}
