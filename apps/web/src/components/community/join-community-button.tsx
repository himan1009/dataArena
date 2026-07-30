import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getWhatsAppCommunityUrl } from "@/lib/community";
import { cn } from "@/lib/utils";

type JoinCommunityButtonProps = {
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showIcon?: boolean;
  label?: string;
};

export function JoinCommunityButton({
  size = "default",
  variant = "default",
  className,
  showIcon = true,
  label = "Join Community",
}: JoinCommunityButtonProps) {
  return (
    <a
      href={getWhatsAppCommunityUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ size, variant }),
        "gap-2",
        className,
      )}
    >
      {showIcon && <MessageCircle className="size-4" />}
      {label}
    </a>
  );
}
