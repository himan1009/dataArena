"use client";

import { buildYouTubeEmbedUrl, isValidYouTubeVideoId } from "@/lib/youtube-utils";
import { cn } from "@/lib/utils";

type YouTubeShortPlayerProps = {
  videoId: string;
  title: string;
  className?: string;
  /** `feed` = centered vertical short (watch page). `inline` = smaller preview (admin). */
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
          "rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive",
          className,
        )}
      >
        This video cannot be embedded (invalid YouTube ID).
      </div>
    );
  }

  const isFeed = variant === "feed";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-black shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]",
        isFeed ? "w-full max-w-[min(100%,22.5rem)]" : "w-full max-w-[min(100%,17.5rem)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative mx-auto w-full bg-black",
          isFeed ? "aspect-[9/16] max-h-[min(78vh,640px)]" : "aspect-[9/16]",
        )}
      >
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
