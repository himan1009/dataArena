import { StandardsViewer } from "@/components/standards/standards-viewer";
import { AppPage } from "@/components/ui/app-page";
import { isAdmin, requireEditor } from "@/lib/auth-server";
import { fetchWritingStandards } from "@/lib/standards-server";

export const metadata = {
  title: "Writing standards",
};

export default async function WriteStandardsPage() {
  const user = await requireEditor();
  const standards = await fetchWritingStandards();

  return (
    <AppPage>
      <StandardsViewer
        standards={standards}
        editHref={isAdmin(user) ? "/admin/standards" : undefined}
      />
    </AppPage>
  );
}
