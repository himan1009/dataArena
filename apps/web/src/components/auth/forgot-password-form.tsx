"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { AuthFooterLink, AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, authApi } from "@/lib/api";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/auth-schemas";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await authApi.forgotPassword(values);
      setSuccess(response.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your account email and we will send reset instructions."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
            {success}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="surface-input"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting || Boolean(success)}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <AuthFooterLink text="Remember your password?" linkText="Sign in" href="/login" />

      <p className="mt-4 text-center text-sm">
        <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
          ← Back to home
        </Link>
      </p>
    </AuthLayout>
  );
}
