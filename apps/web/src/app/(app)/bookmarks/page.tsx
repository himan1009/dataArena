import { Bookmark } from "lucide-react";

import { ComingSoonPage } from "@/components/app/coming-soon-page";

export const metadata = {
  title: "Bookmarks",
};

export default function BookmarksPage() {
  return (
    <ComingSoonPage
      icon={Bookmark}
      title="Bookmarks"
      description="Save topics and articles to revisit later. Pick up exactly where you left off."
      features={[
        "Bookmark any topic or article",
        "Organize saved content",
        "Quick access from sidebar",
        "Sync with progress tracking",
      ]}
    />
  );
}
