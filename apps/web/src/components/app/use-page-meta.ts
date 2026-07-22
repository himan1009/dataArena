"use client";

import { usePathname } from "next/navigation";

import { mainNavItems, secondaryNavItems } from "@/config/app-navigation";

type PageMeta = {
  title: string;
  description: string;
};

const ROUTE_META: Array<{ test: RegExp; meta: PageMeta }> = [
  {
    test: /^\/write\/standards$/,
    meta: {
      title: "Writing standards",
      description: "Mandatory article checkpoints and essential guidelines",
    },
  },
  {
    test: /^\/admin\/standards$/,
    meta: {
      title: "Writing standards",
      description: "",
    },
  },
  {
    test: /^\/admin\/notes\/[^/]+\/edit$/,
    meta: {
      title: "Edit article",
      description: "Admin article editor",
    },
  },
  {
    test: /^\/write\/[^/]+$/,
    meta: {
      title: "Article editor",
      description: "Draft, edit, and submit your article",
    },
  },
  {
    test: /^\/notes\/[^/]+\/[^/]+\/[^/]+$/,
    meta: {
      title: "Article",
      description: "Read published learning content",
    },
  },
  {
    test: /^\/notes\/[^/]+\/[^/]+$/,
    meta: {
      title: "Topic",
      description: "Articles in this learning topic",
    },
  },
  {
    test: /^\/notes\/[^/]+$/,
    meta: {
      title: "Category",
      description: "Topics in this notes category",
    },
  },
  {
    test: /^\/contact$/,
    meta: {
      title: "Contact",
      description: "Get in touch with the DataArena team",
    },
  },
  {
    test: /^\/report-bug$/,
    meta: {
      title: "Report a bug",
      description: "Tell us what went wrong in the app",
    },
  },
];

function findNavMatch(pathname: string) {
  const allItems = [...mainNavItems, ...secondaryNavItems];
  const matches = allItems.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  matches.sort((a, b) => b.href.length - a.href.length);
  return matches[0];
}

export function usePageMeta() {
  const pathname = usePathname();

  for (const route of ROUTE_META) {
    if (route.test.test(pathname)) {
      return route.meta;
    }
  }

  const match = findNavMatch(pathname);

  if (match) {
    return {
      title: match.title,
      description: match.description ?? "Your data engineering workspace",
    };
  }

  return {
    title: "DataArena",
    description: "Your data engineering workspace",
  };
}
