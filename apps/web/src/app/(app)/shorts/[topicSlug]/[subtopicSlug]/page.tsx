import { notFound } from "next/navigation";
import { Clapperboard } from "lucide-react";

import { ShortVideoCard } from "@/components/shorts/short-video-card";
import { ShortsBreadcrumbs } from "@/components/shorts/shorts-breadcrumbs";
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
  const videoCount = subtopic.videos.length;

  return (
    <AppPage size="narrow">
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
        description={
          videoCount > 0
            ? `${videoCount} ${videoCount === 1 ? "video" : "videos"} · scroll to watch in order`
            : "Videos play here in vertical format — no redirect to YouTube."
        }
      />

      {videoCount === 0 ? (
        <EmptyState
          icon={Clapperboard}
          title="No shorts in this subtopic yet"
          description="Your admin can add YouTube links from Shorts CMS."
        />
      ) : (
        <section className="mx-auto flex w-full max-w-xl flex-col gap-8 pb-4">
          {subtopic.videos.map((video, index) => (
            <ShortVideoCard
              key={video.id}
              index={index}
              title={video.title}
              description={video.description}
              youtubeVideoId={video.youtubeVideoId}
            />
          ))}
        </section>
      )}
    </AppPage>
  );
}
