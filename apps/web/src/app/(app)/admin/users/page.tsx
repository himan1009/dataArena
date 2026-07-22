import { Users } from "lucide-react";

import { AdminUsersPanel } from "@/components/admin/admin-users-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { requireAdmin } from "@/lib/auth-server";
import { fetchAdminData } from "@/lib/fetch-server";
import type { AdminUser } from "@/lib/admin-users-api";

export const metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const user = await requireAdmin();

  const data = await fetchAdminData<{ users: AdminUser[] }>("/admin/users");

  return (
    <AppPage>
      <PageIntro
        icon={Users}
        label="Admin"
        title="Users"
        description="Assign editor access, demote contributors back to normal users, or deactivate accounts while keeping their published credits."
      />

      <AdminUsersPanel users={data?.users ?? []} currentUserId={user.id} />
    </AppPage>
  );
}
