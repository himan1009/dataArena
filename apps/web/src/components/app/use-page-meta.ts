"use client";

import { usePathname } from "next/navigation";

import { mainNavItems, secondaryNavItems } from "@/config/app-navigation";

export function usePageMeta() {
  const pathname = usePathname();
  const allItems = [...mainNavItems, ...secondaryNavItems];

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
