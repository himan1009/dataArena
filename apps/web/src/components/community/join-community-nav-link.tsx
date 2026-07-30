"use client";

import { MessageCircle } from "lucide-react";

import { getWhatsAppCommunityUrl } from "@/lib/community";
import { cn } from "@/lib/utils";

export function JoinCommunityNavLink({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={getWhatsAppCommunityUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium text-muted-foreground transition-all duration-200 hover:bg-white/[0.04] hover:text-foreground",
        className,
      )}
    >
      <MessageCircle className="size-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-teal" />
      <span className="flex-1 truncate">Join Community</span>
    </a>
  );
}
