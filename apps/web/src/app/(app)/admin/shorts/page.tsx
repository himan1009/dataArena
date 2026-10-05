import { Clapperboard } from "lucide-react";

import { AdminShortsPanel } from "@/components/shorts/admin-shorts-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { requireAdmin } from "@/lib/auth-server";
import { getAdminShortTopics, ShortsApiError } from "@/lib/shorts-server";

export const metadata = {
  title: "Shorts CMS",
};

export default async function AdminShortsPage() {
  await requireAdmin();

  let topics: Awaited<ReturnType<typeof getAdminShortTopics>>["topics"] = [];
  let loadError: string | null = null;

  try {
    const data = await getAdminShortTopics();
    topics = data.topics;
  } catch (error) {
    if (error instanceof ShortsApiError) {
      loadError = error.message;
    } else {
      throw error;
    }
  }

  return (
    <AppPage>
      <PageIntro
        icon={Clapperboard}
        label="Admin"
        title="Shorts CMS"
        description="Create topics and subtopics, paste YouTube Shorts links, and manage the library."
      />
      {loadError && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      )}
      <AdminShortsPanel topics={topics} />
    </AppPage>
  );
}
