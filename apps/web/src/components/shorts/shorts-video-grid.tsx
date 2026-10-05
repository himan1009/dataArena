import { ShortVideoCard } from "@/components/shorts/short-video-card";
import { cn } from "@/lib/utils";

export type ShortVideoListItem = {
  id: string;
  title: string;
  description?: string | null;
  youtubeVideoId: string;
};

export function ShortsVideoGrid({ videos }: { videos: ShortVideoListItem[] }) {
  const count = videos.length;
  const isSingle = count === 1;

  return (
    <div className="w-full">
      <p className="mb-6 text-center text-xs text-muted-foreground sm:text-sm">
        {count} {count === 1 ? "video" : "videos"} · tap play on each short (hosted on YouTube)
      </p>

      <ul
        className={cn(
          "grid list-none gap-6 sm:gap-8",
          isSingle
            ? "mx-auto max-w-[22rem] grid-cols-1"
            : "mx-auto max-w-6xl grid-cols-1 sm:grid-cols-2",
        )}
      >
        {videos.map((video, index) => (
          <li
            key={video.id}
            className={cn(
              "min-w-0",
              !isSingle &&
                count % 2 === 1 &&
                index === count - 1 &&
                "sm:col-span-2 sm:flex sm:justify-center",
            )}
          >
            <ShortVideoCard
              index={index}
              title={video.title}
              description={video.description}
              youtubeVideoId={video.youtubeVideoId}
              className={cn(
                "w-full",
                !isSingle && count % 2 === 1 && index === count - 1 && "sm:max-w-[22rem]",
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
