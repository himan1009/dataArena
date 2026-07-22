import { Search } from "lucide-react";

import { ComingSoonPage } from "@/components/app/coming-soon-page";

export const metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <ComingSoonPage
      icon={Search}
      title="Search"
      description="Search across notes, practice problems, interview questions, and more — all in one place."
      features={[
        "Full-text search with Meilisearch",
        "Filter by type, category, and difficulty",
        "Instant results with highlighting",
        "Search from anywhere in the app",
      ]}
    />
  );
}
