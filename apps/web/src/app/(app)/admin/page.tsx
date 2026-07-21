import Link from "next/link";
import { Shield, ClipboardCheck, Users, BookOpen, Inbox } from "lucide-react";

import { AdminNotesPanel } from "@/components/admin/admin-notes-panel";
import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth-server";
import { getAdminCategories } from "@/lib/notes-server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admin",
};

const adminLinks = [
  {
    title: "Review queue",
    description: "Approve submissions, assign editors for edit requests, and publish articles.",
    href: "/admin/reviews",
    icon: ClipboardCheck,
  },
  {
    title: "Notes editor",
    description: "Open any article from Notes and use Edit to change it directly as admin.",
    href: "/notes",
    icon: BookOpen,
  },
  {
    title: "Inbox",
    description: "Read contact messages and bug reports. Reply via email with the original message included.",
    href: "/admin/inbox",
    icon: Inbox,
  },
  {
    title: "User management",
    description: "Assign editor roles, demote users, and manage account access.",
    href: "/admin/users",
    icon: Users,
  },
];

export default async function AdminPage() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const categories = await getAdminCategories();

  return (
    <div className="space-y-12 sm:space-y-14">
      <div className="flex items-start gap-5">
        <IconBox icon={Shield} size="lg" className="hidden sm:flex" />
        <PageHeader
          label="Admin CMS"
          title="Content management"
          description="Create categories, topics, and markdown articles for the Knowledge Engine."
        />
      </div>

      <AdminNotesPanel categories={categories} />

      <section className="grid gap-5 sm:grid-cols-2">
        {adminLinks.map((link) => (
          <div key={link.href} className="glass-panel flex flex-col p-7 sm:p-8">
            <IconBox icon={link.icon} size="md" />
            <h3 className="mt-6 text-lg font-semibold tracking-tight">{link.title}</h3>
            <p className="mt-2 flex-1 text-[15px] leading-7 text-muted-foreground">
              {link.description}
            </p>
            <Link
              href={link.href}
              className={cn(buttonVariants(), "mt-6 w-fit")}
            >
              Open {link.title.toLowerCase()}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
