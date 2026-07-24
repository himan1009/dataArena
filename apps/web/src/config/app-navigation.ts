import {
  Bookmark,
  BookOpen,
  Bot,
  ClipboardCheck,
  Code2,
  Inbox,
  LayoutDashboard,
  PenLine,
  Search,
  Settings,
  Shield,
  UserPen,
  Users,
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
    description: "SQL, Python, PySpark labs",
    badge: "Soon",
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
    description: "Content management",
    adminOnly: true,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: ClipboardCheck,
    description: "Author submission queue",
    adminOnly: true,
  },
  {
    title: "Assign writers",
    href: "/admin/assignments",
    icon: UserPen,
    description: "Topic writer assignments",
    adminOnly: true,
  },
  {
    title: "Inbox",
    href: "/admin/inbox",
    icon: Inbox,
    description: "Contact messages and bug reports",
    adminOnly: true,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Roles and account access",
    adminOnly: true,
  },
];

export const protectedRoutes = [
  "/dashboard",
  "/notes",
  "/write",
  "/practice",
  "/search",
  "/bookmarks",
  "/copilot",
  "/settings",
  "/admin",
];
