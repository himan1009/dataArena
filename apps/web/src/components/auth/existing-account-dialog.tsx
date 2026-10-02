"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExistingAccountDialog({
  email,
  open,
  onClose,
  variant = "register",
}: {
  email: string;
  open: boolean;
  onClose: () => void;
  variant?: "register" | "login";
}) {
  if (!open) {
    return null;
  }

  const forgotHref = `/forgot-password?email=${encodeURIComponent(email)}`;
  const loginHref = `/login?email=${encodeURIComponent(email)}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="existing-account-title"
    >
      <div className="glass-panel w-full max-w-md p-6 sm:p-7">
        <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
          <UserRound className="size-5 text-amber-400" />
        </div>
        <h2 id="existing-account-title" className="text-xl font-semibold tracking-tight">
          Account already exists
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {variant === "register"
            ? "An account is already registered with"
            : "We found an account for"}{" "}
          <span className="font-medium text-foreground">{email}</span>.{" "}
          {variant === "register"
            ? "Sign in instead, or reset your password if you forgot it."
            : "Your password was not correct. Try again or use forgot password."}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link href={loginHref} className={cn(buttonVariants(), "h-11 w-full")}>
            Sign in
          </Link>
          <Link
            href={forgotHref}
            className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full border-white/[0.1]")}
          >
            Forgot password
          </Link>
          <button
            type="button"
            onClick={onClose}
            className={cn(buttonVariants({ variant: "ghost" }), "h-10 w-full")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
