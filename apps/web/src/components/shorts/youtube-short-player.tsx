"use client";

import { buildYouTubeEmbedUrl, isValidYouTubeVideoId } from "@/lib/youtube-utils";
import { cn } from "@/lib/utils";

export function YouTubeShortPlayer({
  videoId,
  title,
  className,
}: {
  videoId: string;
  title: string;
  className?: string;
}) {
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

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-[9/16] w-full max-w-[min(100%,320px)] mx-auto">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
