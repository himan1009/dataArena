import type { AuthUser } from "@/lib/api";

import { MeshBackground } from "@/components/ui/mesh-background";
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
      <MeshBackground variant="subtle" />

      <div className={`hidden shrink-0 lg:block ${SIDEBAR_WIDTH}`}>
        <AppSidebar user={user} className={`fixed inset-y-0 left-0 z-30 ${SIDEBAR_WIDTH}`} />
      </div>

      <div className={`relative flex min-w-0 flex-1 flex-col lg:pl-[18rem]`}>
        <AppHeader user={user} />
        <AppMain>{children}</AppMain>
      </div>
    </div>
  );
}
