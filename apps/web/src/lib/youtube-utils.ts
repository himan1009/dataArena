export const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function isValidYouTubeVideoId(videoId: string): boolean {
  return YOUTUBE_VIDEO_ID_REGEX.test(videoId);
}

function normalizeYouTubeUrl(url: string): string {
  return url
    .replace(/^https?:\/\/m\.youtube\.com/i, "https://www.youtube.com")
    .replace(/^https?:\/\/music\.youtube\.com/i, "https://www.youtube.com");
}

export function extractYouTubeVideoId(url: string): string | null {
  const trimmed = normalizeYouTubeUrl(url.trim());
  if (!trimmed) return null;

  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  if (isValidYouTubeVideoId(trimmed)) return trimmed;
  return null;
}

export function buildYouTubeEmbedUrl(videoId: string): string {
  if (!isValidYouTubeVideoId(videoId)) {
    return "";
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}
