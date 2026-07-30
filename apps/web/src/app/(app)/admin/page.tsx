import Link from "next/link";
import { Shield, ClipboardCheck, Users, BookOpen, Inbox, BookOpenCheck, UserPen, Code2 } from "lucide-react";

import { AppPage } from "@/components/ui/app-page";
import { IconBox } from "@/components/ui/icon-box";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admin",
};

const adminLinks = [
  {
    title: "Articles CMS",
    description: "Create categories, topics, and markdown articles for the Notes learning hub.",
    href: "/admin/articles",
    icon: BookOpen,
  },
  {
    title: "Practice CMS",
    description: "Create practice categories and topics for the question library.",
    href: "/admin/practice",
    icon: Code2,
  },
  {
    title: "Assign writers",
    description: "Assign each topic to one editor. Only assigned writers can start that article.",
    href: "/admin/assignments",
    icon: UserPen,
  },
  {
    title: "Reviews",
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
    description: "Contact messages, bug reports, and interview experience reports.",
    href: "/admin/inbox",
    icon: Inbox,
  },
  {
    title: "Writing standards",
    description: "Edit the mandatory article checkpoints and essential writing guidelines for all editors.",
    href: "/admin/standards",
    icon: BookOpenCheck,
  },
  {
    title: "Users",
    description: "Editor roles, practice question upload permission, and account access",
    href: "/admin/users",
    icon: Users,
  },
];

export default async function AdminPage() {
  await requireAdmin();

  return (
    <AppPage>
      <PageIntro
        icon={Shield}
        label="Admin CMS"
        title="Content management"
        description="Manage articles, practice questions, reviews, writers, and platform settings from one hub."
      />

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
    </AppPage>
  );
}
