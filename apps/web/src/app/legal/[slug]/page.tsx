import { notFound } from "next/navigation";

import { LegalDocument } from "@/components/legal/legal-document";
import { MarketingPageShell } from "@/components/legal/marketing-page-shell";
import { legalPages, legalPagesBySlug } from "@/lib/legal-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = legalPagesBySlug[slug];

  if (!page) {
    return { title: "Legal" };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const page = legalPagesBySlug[slug];

  if (!page) {
    notFound();
  }

  return (
    <MarketingPageShell>
      <LegalDocument page={page} />
    </MarketingPageShell>
  );
}
