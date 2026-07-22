import { StandardsAdminEditor } from "@/components/standards/standards-admin-editor";
import { AppPage } from "@/components/ui/app-page";
import { requireAdmin } from "@/lib/auth-server";
import { fetchWritingStandards } from "@/lib/standards-server";

export const metadata = {
  title: "Manage writing standards",
};

export default async function AdminStandardsPage() {
  await requireAdmin();
  const standards = await fetchWritingStandards();

  return (
    <AppPage size="full">
      <StandardsAdminEditor initialStandards={standards} />
    </AppPage>
  );
}
