import { UserPen } from "lucide-react";

import { AdminTopicAssignmentsPanel } from "@/components/admin/admin-topic-assignments-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { requireAdmin } from "@/lib/auth-server";
import { getAdminCategories } from "@/lib/notes-server";

export const metadata = {
  title: "Assign writers",
};

export default async function AdminAssignmentsPage() {
  await requireAdmin();
  const categories = await getAdminCategories();

  return (
    <AppPage>
      <PageIntro
        icon={UserPen}
        label="Admin"
        title="Assign writers"
        description="Pick a category, then assign each topic to one editor. Only assigned writers see that topic under Write."
      />

      <AdminTopicAssignmentsPanel categories={categories} />
    </AppPage>
  );
}
