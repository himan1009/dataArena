import { MessageCircle, Users } from "lucide-react";

import { JoinCommunityButton } from "@/components/community/join-community-button";
import { IconBox } from "@/components/ui/icon-box";

type JoinCommunityCardProps = {
  title?: string;
  description?: string;
};

export function JoinCommunityCard({
  title = "Join the Data Arena community",
  description = "Connect with data engineers on WhatsApp — ask questions, share interview prep tips, and stay updated on new content.",
}: JoinCommunityCardProps) {
  return (
    <section className="glass-panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex items-start gap-4">
        <IconBox icon={Users} size="md" tint="teal" />
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
            <MessageCircle className="size-3.5" />
            WhatsApp community
          </p>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <JoinCommunityButton
        size="lg"
        className="w-full shrink-0 sm:w-auto"
      />
    </section>
  );
}
