"use client";

import { buildYouTubeEmbedUrl, isValidYouTubeVideoId } from "@/lib/youtube-utils";
import { cn } from "@/lib/utils";

type YouTubeShortPlayerProps = {
  videoId: string;
  title: string;
  className?: string;
  /** `feed` = watch page. `inline` = admin preview. */
  variant?: "feed" | "inline";
};

export function YouTubeShortPlayer({
  videoId,
  title,
  className,
  variant = "feed",
}: YouTubeShortPlayerProps) {
  const embedUrl = buildYouTubeEmbedUrl(videoId);

  if (!isValidYouTubeVideoId(videoId) || !embedUrl) {
    return (
      <div
        className={cn(
          "flex aspect-[9/16] w-full items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 px-4 text-center text-sm text-destructive",
          className,
        )}
      >
        Invalid YouTube video.
      </div>
    );
  }

  const isInline = variant === "inline";

  return (
    <div
      className={cn(
        "w-full",
        isInline ? "max-w-[15rem]" : "max-w-[min(100%,20rem)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-white/[0.12] bg-black shadow-lg shadow-black/40",
          "aspect-[9/16]",
        )}
      >
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
