import { UserPen } from "lucide-react";

import { AdminTopicAssignmentsPanel } from "@/components/admin/admin-topic-assignments-panel";
import { AdminLoadError } from "@/components/admin/admin-load-error";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { requireAdmin } from "@/lib/auth-server";
import { getAdminCategories, NotesApiError } from "@/lib/notes-server";

export const metadata = {
  title: "Assign writers",
};

export default async function AdminAssignmentsPage() {
  await requireAdmin();

  let categories: Awaited<ReturnType<typeof getAdminCategories>> = [];
  let loadError: string | null = null;

  try {
    categories = await getAdminCategories();
  } catch (error) {
    loadError =
      error instanceof NotesApiError
        ? error.message
        : "Failed to load topics from the API.";
  }

  return (
    <AppPage>
      <PageIntro
        icon={UserPen}
        label="Admin"
        title="Assign writers"
        description="Pick a category, then assign each topic to one editor. Only assigned writers see that topic under Write."
      />

      {loadError ? (
        <AdminLoadError error={loadError} />
      ) : (
        <AdminTopicAssignmentsPanel categories={categories} />
      )}
    </AppPage>
  );
}
