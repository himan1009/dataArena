import { notFound } from "next/navigation";
import { Clapperboard } from "lucide-react";

import { ShortsBreadcrumbs } from "@/components/shorts/shorts-breadcrumbs";
import { YouTubeShortPlayer } from "@/components/shorts/youtube-short-player";
import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { getShortSubtopic, ShortsApiError } from "@/lib/shorts-server";

type PageProps = {
  params: Promise<{ topicSlug: string; subtopicSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { topicSlug, subtopicSlug } = await params;
  try {
    const data = await getShortSubtopic(topicSlug, subtopicSlug);
    return { title: `${data.subtopic.name} · Shorts` };
  } catch {
    return { title: "Shorts" };
  }
}

export default async function ShortSubtopicPage({ params }: PageProps) {
  const { topicSlug, subtopicSlug } = await params;

  let data;
  try {
    data = await getShortSubtopic(topicSlug, subtopicSlug);
  } catch (error) {
    if (error instanceof ShortsApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { subtopic } = data;

  return (
    <AppPage>
      <ShortsBreadcrumbs
        items={[
          { label: "Shorts", href: "/shorts" },
          { label: subtopic.topic.name, href: `/shorts/${subtopic.topic.slug}` },
          { label: subtopic.name },
        ]}
      />

      <PageIntro
        icon={Clapperboard}
        label={subtopic.topic.name}
        title={subtopic.name}
        description="Watch in order. Videos play inside DataArena via YouTube embed."
      />

      <section className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {subtopic.videos.length === 0 ? (
          <EmptyState
            className="lg:col-span-2 xl:col-span-3"
            icon={Clapperboard}
            title="No shorts in this subtopic yet"
            description="Your admin can add YouTube links from Shorts CMS."
          />
        ) : (
          subtopic.videos.map((video, index) => (
            <article key={video.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-base font-semibold">{video.title}</h2>
              </div>
              <YouTubeShortPlayer videoId={video.youtubeVideoId} title={video.title} />
              {video.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {video.description}
                </p>
              )}
            </article>
          ))
        )}
      </section>
    </AppPage>
  );
}
