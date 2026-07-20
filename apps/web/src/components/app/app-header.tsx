"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { usePageMeta } from "@/components/app/use-page-meta";
import { AppSidebar, SIDEBAR_WIDTH } from "@/components/app/app-sidebar";
import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { AuthUser } from "@/lib/api";

export function AppHeader({ user }: { user: AuthUser }) {
  const { title, description } = usePageMeta();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-[4.75rem] shrink-0 items-center gap-4 border-b border-white/[0.07] bg-background/75 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-white/[0.1] bg-white/[0.02] lg:hidden"
            />
          }
        >
          <Menu className="size-4" />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="left" className={`${SIDEBAR_WIDTH} border-white/[0.07] bg-sidebar p-0`}>
          <AppSidebar user={user} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </h1>
        {description && (
          <p className="truncate text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <UserMenu user={user} />
    </header>
  );
}
