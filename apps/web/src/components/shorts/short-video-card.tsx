import { YouTubeShortPlayer } from "@/components/shorts/youtube-short-player";
import { cn } from "@/lib/utils";

export function ShortVideoCard({
  index,
  title,
  description,
  youtubeVideoId,
  className,
}: {
  index: number;
  title: string;
  description?: string | null;
  youtubeVideoId: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "glass-panel flex h-full min-h-0 flex-col gap-4 p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3 border-b border-white/[0.06] pb-4">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold tabular-nums text-primary"
          aria-hidden
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-snug tracking-tight sm:text-[17px]">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-1">
        <YouTubeShortPlayer
          videoId={youtubeVideoId}
          title={title}
          variant="feed"
          className="mx-auto"
        />
      </div>
    </article>
  );
}
