import { redirect } from "next/navigation";
import { Users } from "lucide-react";

import { AdminUsersPanel } from "@/components/admin/admin-users-panel";
import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { requireUser } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";
import type { AdminUser } from "@/lib/admin-users-api";

export const metadata = {
  title: "User management",
};

export default async function AdminUsersPage() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const cookieStore = await import("next/headers").then((mod) => mod.cookies());
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(getBackendUrl("/admin/users"), {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  const data = response.ok
    ? ((await response.json()) as { users: AdminUser[] })
    : { users: [] };

  return (
    <div className="space-y-12 sm:space-y-14">
      <div className="flex items-start gap-5">
        <IconBox icon={Users} size="lg" className="hidden sm:flex" />
        <PageHeader
          label="Admin"
          title="User management"
          description="Assign editor access, demote contributors back to normal users, or deactivate accounts while keeping their published credits."
        />
      </div>

      <AdminUsersPanel users={data.users ?? []} currentUserId={user.id} />
    </div>
  );
}
