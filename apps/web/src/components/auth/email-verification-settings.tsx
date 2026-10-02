"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiError, authApi } from "@/lib/api";

export function EmailVerificationSettings({
  emailVerified,
}: {
  emailVerified?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (emailVerified !== false) {
    return (
      <Badge className="mt-2.5 border-0 bg-teal-muted px-3 py-1 text-xs font-medium text-teal">
        Verified
      </Badge>
    );
  }

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await authApi.resendVerification();
      setMessage(response.message);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2.5 space-y-3">
      <Badge className="border-0 bg-orange-500/15 px-3 py-1 text-xs font-medium text-orange-300">
        Not verified
      </Badge>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/[0.1]"
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
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
