"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  variant = "outline",
  showIcon = true,
}: {
  className?: string;
  variant?: "outline" | "ghost" | "destructive";
  showIcon?: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await authApi.logout();
    } catch {
      // Continue to login even if logout request fails
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        "w-full gap-2",
        variant === "outline" && "border-white/10 bg-white/5 hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : showIcon ? (
        <LogOut className="size-4" />
      ) : null}
      {isLoading ? "Logging out..." : "Log out"}
    </Button>
  );
}
