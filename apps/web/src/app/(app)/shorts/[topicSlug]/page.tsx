import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clapperboard, Files } from "lucide-react";

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
        icon={Clapperboard}
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
              className="glass-panel glass-panel-hover group flex items-center justify-between gap-4 px-5 py-5 sm:px-6"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold tabular-nums text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold tracking-tight">{subtopic.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subtopic.videoCount ?? 0}{" "}
                    {(subtopic.videoCount ?? 0) === 1 ? "short" : "shorts"}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>
          ))
        )}
      </section>
    </AppPage>
  );
}
