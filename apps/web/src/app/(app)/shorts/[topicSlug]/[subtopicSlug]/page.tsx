import { notFound } from "next/navigation";
import { Clapperboard } from "lucide-react";

import { ShortsVideoGrid } from "@/components/shorts/shorts-video-grid";
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
        description={
          videoCount > 0
            ? "Watch in order — vertical shorts, embedded in DataArena."
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
        <ShortsVideoGrid videos={subtopic.videos} />
      )}
    </AppPage>
  );
}
