"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { mainNavItems, secondaryNavItems, type NavItem } from "@/config/app-navigation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/api";

const SIDEBAR_WIDTH = "w-[18rem]";

function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition-all duration-200",
        isActive
          ? "nav-active pl-5 text-foreground"
          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
      )}
    >
      <item.icon
        className={cn(
          "size-[18px] shrink-0",
          isActive ? "text-gold" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span className="flex-1 truncate">{item.title}</span>
      {item.badge && (
        <Badge className="border-0 bg-white/[0.05] px-2 py-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}

export function AppSidebar({
  user,
  onNavigate,
  className,
}: {
  user: AuthUser;
  onNavigate?: () => void;
  className?: string;
}) {
  const visibleSecondary = secondaryNavItems.filter(
    (item) => {
      if (item.adminOnly && user.role !== "ADMIN") return false;
      return true;
    },
  );

  const visibleMain = mainNavItems.filter((item) => {
    if (item.editorOnly && user.role !== "EDITOR" && user.role !== "ADMIN") {
      return false;
    }
    return true;
  });

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/[0.07] bg-sidebar/95 backdrop-blur-xl",
        SIDEBAR_WIDTH,
        className,
      )}
    >
      <div className="flex h-[4.75rem] shrink-0 items-center border-b border-white/[0.07] px-6">
        <Logo showTagline href="/dashboard" />
      </div>

      <ScrollArea className="flex-1 px-4 py-7">
        <nav className="space-y-1.5">
          <p className="section-label mb-4 px-3">Learn</p>
          {visibleMain.map((item) => (
            <NavLink key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </nav>

        <Separator className="my-7 bg-white/[0.06]" />

        <nav className="space-y-1.5">
          <p className="section-label mb-4 px-3">Account</p>
          {visibleSecondary.map((item) => (
            <NavLink key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </ScrollArea>

      <div className="shrink-0 border-t border-white/[0.07] p-5">
        <Link
          href="/settings"
          className="glass-panel block rounded-2xl p-4 transition-colors hover:bg-white/[0.03]"
        >
          <p className="truncate text-sm font-semibold">
            {user.name || user.email.split("@")[0]}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
          <Badge className="mt-3 border-0 bg-gold-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gold">
            {user.role}
          </Badge>
        </Link>
      </div>
    </aside>
  );
}

export { SIDEBAR_WIDTH };
