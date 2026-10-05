import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Files } from "lucide-react";

import { ShortsBreadcrumbs } from "@/components/shorts/shorts-breadcrumbs";
import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { getShortTopic, ShortsApiError } from "@/lib/shorts-server";

type PageProps = {
  params: Promise<{ topicSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { topicSlug } = await params;
  try {
    const data = await getShortTopic(topicSlug);
    return { title: `${data.topic.name} · Shorts` };
  } catch {
    return { title: "Shorts topic" };
  }
}

export default async function ShortTopicPage({ params }: PageProps) {
  const { topicSlug } = await params;

  let data;
  try {
    data = await getShortTopic(topicSlug);
  } catch (error) {
    if (error instanceof ShortsApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { topic } = data;
  const subtopics = topic.subtopics ?? [];

  return (
    <AppPage>
      <ShortsBreadcrumbs
        items={[
          { label: "Shorts", href: "/shorts" },
          { label: topic.name },
        ]}
      />

      <PageIntro
        icon={FileText}
        label="Topic"
        title={topic.name}
        description={topic.description ?? "Pick a subtopic to watch embedded YouTube shorts."}
      />

      <section className="space-y-3">
        {subtopics.length === 0 ? (
          <EmptyState icon={Files} title="No subtopics yet" description="Check back soon." />
        ) : (
          subtopics.map((subtopic, index) => (
            <Link
              key={subtopic.id}
              href={`/shorts/${topic.slug}/${subtopic.slug}`}
              className="glass-panel glass-panel-hover flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-8 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium">{subtopic.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {subtopic.videoCount ?? 0}{" "}
                    {(subtopic.videoCount ?? 0) === 1 ? "short" : "shorts"}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </AppPage>
  );
}
