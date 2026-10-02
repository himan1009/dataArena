"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { buttonVariants } from "@/components/ui/button";
import { ApiError, authApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export function VerifyEmailClient({ token }: { token: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification link is invalid.");
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await authApi.verifyEmail({ token });
        if (!cancelled) {
          setStatus("success");
          setMessage(response.message);
          router.refresh();
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setMessage(err instanceof ApiError ? err.message : "Verification failed.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <AuthLayout
      title="Email verification"
      subtitle={
        status === "loading"
          ? "Confirming your email address..."
          : status === "success"
            ? "You are all set."
            : "We could not verify this link."
      }
    >
      <div className="space-y-5 text-center">
        {status === "loading" && (
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        )}
        {status !== "loading" && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
        {status === "success" && (
          <Link href="/dashboard" className={cn(buttonVariants(), "h-11 w-full")}>
            Go to dashboard
          </Link>
        )}
        {status === "error" && (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 w-full border-white/[0.1]",
              )}
            >
              Sign in
            </Link>
            <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "h-11 w-full")}>
              Back to home
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
