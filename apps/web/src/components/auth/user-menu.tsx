"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authApi, type AuthUser } from "@/lib/api";
import { cn } from "@/lib/utils";

function getInitials(user: AuthUser) {
  if (user.name) {
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

function MenuItem({
  children,
  className,
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const classes = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-white/[0.06]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export function UserMenu({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    close();
    try {
      await authApi.logout();
    } catch {
      // continue to login even if logout fails
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
        className="flex size-10 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.02] transition-all hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
            {getInitials(user)}
          </AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-2xl border border-white/[0.08] bg-card/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="px-2 py-2">
            <p className="text-sm font-semibold">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="my-1 h-px bg-white/[0.06]" />

          <MenuItem href="/dashboard" onClick={close}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </MenuItem>
          <MenuItem href="/settings" onClick={close}>
            <User className="size-4" />
            Settings
          </MenuItem>

          <div className="my-1 h-px bg-white/[0.06]" />

          <MenuItem
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </MenuItem>
        </div>
      )}
    </div>
  );
}
