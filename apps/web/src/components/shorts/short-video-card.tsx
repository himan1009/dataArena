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
        "glass-panel flex w-full max-w-xl flex-col items-center gap-5 p-5 sm:p-7",
        className,
      )}
    >
      <div className="flex w-full items-center gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold tabular-nums text-primary"
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight">{title}</h2>
      </div>

      <YouTubeShortPlayer
        videoId={youtubeVideoId}
        title={title}
        variant="feed"
        className="mx-auto w-full"
      />

      {description ? (
        <p className="w-full text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}

      <p className="text-center text-[11px] text-muted-foreground/80">
        Plays inside DataArena · hosted on YouTube
      </p>
    </article>
  );
}
