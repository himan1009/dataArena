"use client";

import { usePathname } from "next/navigation";

import { mainNavItems, secondaryNavItems } from "@/config/app-navigation";

export function usePageMeta() {
  const pathname = usePathname();
  const allItems = [...mainNavItems, ...secondaryNavItems];

  if (pathname === "/contact") {
    return {
      title: "Contact",
      description: "Get in touch with the DataArena team",
    };
  }

  if (pathname === "/report-bug") {
    return {
      title: "Report a bug",
      description: "Tell us what went wrong in the app",
    };
  }

  const match = allItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  if (match) {
    return {
      title: match.title,
      description: match.description,
    };
  }

  return {
    title: "DataArena",
    description: "Your data engineering workspace",
  };
}
