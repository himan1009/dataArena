"use client";

import { usePathname } from "next/navigation";

import { PageContainer } from "@/components/ui/page-container";

export function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isArticleEditor = /^\/write\/[^/]+$/.test(pathname);
  const isAdminArticleEditor = /^\/admin\/notes\/[^/]+\/edit$/.test(pathname);
  const isArticleReader = /^\/notes\/[^/]+\/[^/]+\/[^/]+$/.test(pathname);

  const containerSize = isArticleEditor || isAdminArticleEditor
    ? "editor"
    : isArticleReader
      ? "article"
      : "default";

  return (
    <main
      className={
        isArticleEditor || isAdminArticleEditor
          ? "flex min-h-0 flex-1 flex-col py-4 sm:py-5"
          : isArticleReader
            ? "flex-1 py-5 sm:py-6"
            : "flex-1 py-7 sm:py-10"
      }
    >
      <PageContainer
        size={containerSize}
        className={
          isArticleEditor || isAdminArticleEditor
            ? "flex min-h-0 flex-1 flex-col px-3 sm:px-5 lg:px-6"
            : isArticleReader
              ? "px-4 sm:px-8 lg:px-10 xl:px-12"
              : undefined
        }
      >
        {children}
      </PageContainer>
    </main>
  );
}
