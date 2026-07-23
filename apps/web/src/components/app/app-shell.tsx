import { Suspense } from "react";

import type { AuthUser } from "@/lib/api";

import { MeshBackground } from "@/components/ui/mesh-background";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { AppHeader } from "./app-header";
import { AppMain } from "./app-main";
import { AppSidebar, SIDEBAR_WIDTH } from "./app-sidebar";

export function AppShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <MeshBackground variant="subtle" />

      <div className={`hidden shrink-0 lg:block ${SIDEBAR_WIDTH}`}>
        <AppSidebar user={user} className={`fixed inset-y-0 left-0 z-30 ${SIDEBAR_WIDTH}`} />
      </div>

      <div className={`relative flex min-h-0 min-w-0 flex-1 flex-col lg:pl-[18rem]`}>
        <AppHeader user={user} />
        <AppMain>{children}</AppMain>
      </div>
    </div>
  );
}
