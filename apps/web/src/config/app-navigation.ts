import {
  Bookmark,
  BookOpen,
  Bot,
  Briefcase,
  Code2,
  LayoutDashboard,
  PenLine,
  Search,
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
};

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and progress",
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
    title: "Write",
    href: "/write",
    icon: PenLine,
    description: "Author workspace",
    editorOnly: true,
  },
  {
    title: "Practice",
    href: "/practice",
    icon: Code2,
    description: "Curated practice questions by topic",
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
    description: "Find topics and content",
    badge: "Soon",
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
    description: "Saved topics and articles",
    badge: "Soon",
  },
  {
    title: "AI Copilot",
    href: "/copilot",
    icon: Bot,
    description: "Contextual AI assistant",
    badge: "Soon",
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
    description: "Articles, practice, reviews, inbox, and users",
    adminOnly: true,
  },
];

export const protectedRoutes = [
  "/dashboard",
  "/notes",
  "/practice",
  "/write",
  "/search",
  "/bookmarks",
  "/copilot",
  "/settings",
  "/admin",
];
