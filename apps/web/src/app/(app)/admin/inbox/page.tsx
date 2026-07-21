import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";

import { AdminInboxPanel } from "@/components/admin/admin-inbox-panel";
import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { requireUser } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";

export const metadata = {
  title: "Inbox",
};

async function fetchAdminJson(path: string, cookieHeader: string) {
  const response = await fetch(getBackendUrl(path), {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  return response.ok ? response.json() : null;
}

export default async function AdminInboxPage() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const cookieStore = await import("next/headers").then((mod) => mod.cookies());
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const [contactsData, bugsData] = await Promise.all([
    fetchAdminJson("/feedback/admin/contacts", cookieHeader),
    fetchAdminJson("/feedback/admin/bugs", cookieHeader),
  ]);

  return (
    <div className="space-y-12 sm:space-y-14">
      <div className="flex items-start gap-5">
        <IconBox icon={Inbox} size="lg" className="hidden sm:flex" />
        <PageHeader
          label="Admin"
          title="Inbox"
          description="Contact messages and bug reports from users. Reply via email with their original message included."
        />
      </div>

      <AdminInboxPanel
        contacts={contactsData?.messages ?? []}
        bugs={bugsData?.reports ?? []}
      />
    </div>
  );
}
