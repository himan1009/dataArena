"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingLabel?: React.ReactNode;
};

export function LoadingButton({
  loading = false,
  loadingLabel,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(loading && "pointer-events-none", className)}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingLabel ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
