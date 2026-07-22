import { Inbox } from "lucide-react";

import { AdminInboxPanel } from "@/components/admin/admin-inbox-panel";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { requireAdmin } from "@/lib/auth-server";
import { fetchAdminData } from "@/lib/fetch-server";
import type { BugReport, ContactMessage } from "@/lib/feedback-api";

export const metadata = {
  title: "Inbox",
};

export default async function AdminInboxPage() {
  await requireAdmin();

  const [contactsData, bugsData] = await Promise.all([
    fetchAdminData<{ messages: ContactMessage[] }>("/feedback/admin/contacts"),
    fetchAdminData<{ reports: BugReport[] }>("/feedback/admin/bugs"),
  ]);

  return (
    <AppPage>
      <PageIntro
        icon={Inbox}
        label="Admin"
        title="Inbox"
        description="Contact messages and bug reports from users. Reply via email with their original message included."
      />

      <AdminInboxPanel
        contacts={contactsData?.messages ?? []}
        bugs={bugsData?.reports ?? []}
      />
    </AppPage>
  );
}
