import {
  BookOpen,
  Cloud,
  Database,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Database,
  Workflow,
  Server,
  Cloud,
  BookOpen,
};

export function getCategoryIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName) {
    return BookOpen;
  }

  return iconMap[iconName] ?? BookOpen;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
