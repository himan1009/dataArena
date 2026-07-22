"use client";

import { usePathname } from "next/navigation";

import { PageContainer } from "@/components/ui/page-container";

export function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isArticleEditor = /^\/write\/[^/]+$/.test(pathname);
  const isAdminArticleEditor = /^\/admin\/notes\/[^/]+\/edit$/.test(pathname);
  const isAdminStandardsEditor = pathname === "/admin/standards";
  const isArticleReader = /^\/notes\/[^/]+\/[^/]+\/[^/]+$/.test(pathname);
  const isWriteStandards = pathname === "/write/standards";
  const isEditorLayout =
    isArticleEditor || isAdminArticleEditor || isAdminStandardsEditor;

  const containerSize = isEditorLayout
    ? "editor"
    : isArticleReader
      ? "article"
      : "default";

  return (
    <main
      className={
        isEditorLayout
          ? "flex min-h-0 flex-1 flex-col overflow-hidden py-4 sm:py-5 lg:h-[calc(100vh-4.75rem)]"
          : "flex-1 py-7 sm:py-10"
      }
    >
      <PageContainer
        size={containerSize}
        className={
          isEditorLayout
            ? "flex min-h-0 flex-1 flex-col px-3 sm:px-5 lg:px-6"
            : isArticleReader
              ? "px-4 sm:px-8 lg:px-10 xl:px-12"
              : isWriteStandards
                ? "max-w-7xl"
                : undefined
        }
      >
        {children}
      </PageContainer>
    </main>
  );
}
