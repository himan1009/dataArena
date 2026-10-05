import {
  BookOpen,
  Bot,
  Briefcase,
  Clapperboard,
  Code2,
  LayoutDashboard,
  PenLine,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  adminOnly?: boolean;
  editorOnly?: boolean;
  creatorOnly?: boolean;
};

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and quick links",
  },
  {
    title: "Notes",
    href: "/notes",
    icon: BookOpen,
    description: "Learning hubs and articles",
  },
  {
    title: "Interviews",
    href: "/interviews",
    icon: Briefcase,
    description: "Community interview experiences",
  },
  {
    title: "Shorts",
    href: "/shorts",
    icon: Clapperboard,
    description: "Embedded YouTube short videos by topic",
  },
  {
    title: "Practice",
    href: "/practice",
    icon: Code2,
    description: "Curated practice questions by topic",
  },
  {
    title: "AI Copilot",
    href: "/copilot",
    icon: Bot,
    description: "Contextual AI assistant",
    badge: "Soon",
  },
];

export const creatorNavItems: NavItem[] = [
  {
    title: "Write",
    href: "/write",
    icon: PenLine,
    description: "Author workspace",
    creatorOnly: true,
    editorOnly: true,
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and preferences",
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Shield,
    description: "Articles, practice, shorts, reviews, inbox, and users",
    adminOnly: true,
  },
];

export const protectedRoutes = [
  "/dashboard",
  "/notes",
  "/practice",
  "/shorts",
  "/write",
  "/copilot",
  "/settings",
  "/admin",
];
