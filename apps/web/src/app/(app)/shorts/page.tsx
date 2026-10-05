import Link from "next/link";
import { ArrowUpRight, Clapperboard, FolderOpen } from "lucide-react";

import { AppPage } from "@/components/ui/app-page";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { PageIntro } from "@/components/ui/page-intro";
import { getShortTopics, ShortsApiError } from "@/lib/shorts-server";

export const metadata = {
  title: "Short videos",
};

export default async function ShortsPage() {
  let topics: Awaited<ReturnType<typeof getShortTopics>>["topics"] = [];
  let loadFailed = false;

  try {
    const data = await getShortTopics();
    topics = data.topics;
  } catch (error) {
    if (error instanceof ShortsApiError) {
      loadFailed = true;
    } else {
      throw error;
    }
  }

  return (
    <AppPage>
      <PageIntro
        icon={Clapperboard}
        label="Shorts"
        title="Short videos"
        description="Bite-sized lessons hosted on YouTube and played right here — browse by topic and subtopic."
      />

      <section className="grid gap-5 sm:grid-cols-2">
        {loadFailed ? (
          <EmptyState
            className="sm:col-span-2"
            icon={FolderOpen}
            title="Short videos unavailable"
            description="We could not load topics right now. If the API was asleep, refresh in a minute or open your API health URL once."
          />
        ) : topics.length === 0 ? (
          <EmptyState
            className="sm:col-span-2"
            icon={FolderOpen}
            title="No short video topics yet"
            description="Topics will appear here once your admin team adds them in Shorts CMS."
          />
        ) : (
          topics.map((topic) => {
            const subtopicCount = topic.subtopics?.length ?? 0;
            const videoCount = topic.videoCount ?? 0;

            return (
              <Link
                key={topic.id}
                href={`/shorts/${topic.slug}`}
                className="glass-panel glass-panel-hover group p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <IconBox icon={Clapperboard} size="md" tint="teal" />
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{topic.name}</h3>
                {topic.description && (
                  <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                    {topic.description}
                  </p>
                )}
                <p className="mt-4 meta-text">
                  {subtopicCount} {subtopicCount === 1 ? "subtopic" : "subtopics"} · {videoCount}{" "}
                  {videoCount === 1 ? "short" : "shorts"}
                </p>
              </Link>
            );
          })
        )}
      </section>
    </AppPage>
  );
}
