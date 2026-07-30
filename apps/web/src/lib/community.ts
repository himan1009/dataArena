const DEFAULT_WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/Erxv6iWzWZt078kEW2vOg9";

export function getWhatsAppCommunityUrl() {
  const url =
    process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL?.trim() ||
    DEFAULT_WHATSAPP_COMMUNITY_URL;

  if (!url.startsWith("https://chat.whatsapp.com/")) {
    return DEFAULT_WHATSAPP_COMMUNITY_URL;
  }

  return url;
}

export function isCommunityLinkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL?.trim());
}
