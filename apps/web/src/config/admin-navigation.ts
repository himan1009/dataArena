import {
  BookOpen,
  BookOpenCheck,
  Clapperboard,
  ClipboardCheck,
  Code2,
  Inbox,
  Shield,
  UserPen,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminHubLink = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

/** Cards on `/admin` — single source of truth for Admin CMS hub. */
export const adminHubLinks: AdminHubLink[] = [
  {
    title: "Articles CMS",
    description:
      "Create categories, topics, and markdown articles for the Notes learning hub.",
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
    title: "Shorts CMS",
    description:
      "YouTube Shorts: topics, subtopics, and in-app embedded videos for members.",
    href: "/admin/shorts",
    icon: Clapperboard,
  },
  {
    title: "Assign writers",
    description:
      "Assign each topic to one editor. Only assigned writers can start that article.",
    href: "/admin/assignments",
    icon: UserPen,
  },
  {
    title: "Reviews",
    description:
      "Approve submissions, assign editors for edit requests, and publish articles.",
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
    description:
      "Edit the mandatory article checkpoints and essential writing guidelines for all editors.",
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

/** Sidebar shortcuts (admins only). */
export const adminSidebarLinks: AdminHubLink[] = [
  {
    title: "Admin hub",
    description: "All CMS tools",
    href: "/admin",
    icon: Shield,
  },
  {
    title: "Shorts CMS",
    description: "YouTube short videos",
    href: "/admin/shorts",
    icon: Clapperboard,
  },
  {
    title: "Practice CMS",
    description: "Practice library structure",
    href: "/admin/practice",
    icon: Code2,
  },
  {
    title: "Articles CMS",
    description: "Notes structure and articles",
    href: "/admin/articles",
    icon: BookOpen,
  },
];
