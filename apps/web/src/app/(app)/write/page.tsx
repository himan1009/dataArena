import Link from "next/link";
import { PenLine, BookOpenCheck } from "lucide-react";

import { AuthorWorkspace } from "@/components/author/author-workspace";
import { LinkedinProfileForm } from "@/components/author/linkedin-profile-form";
import { AppPage } from "@/components/ui/app-page";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { requireEditor } from "@/lib/auth-server";
import { fetchAuthorData } from "@/lib/fetch-server";
import type { AvailableTopic, MyArticle } from "@/lib/notes-api";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Write",
};

export default async function WritePage() {
  const user = await requireEditor();

  const [topicsData, articlesData] = await Promise.all([
    fetchAuthorData<{ topics: AvailableTopic[] }>("/author/topics/available"),
    fetchAuthorData<{ writtenBy: MyArticle[]; editedBy: MyArticle[] }>("/author/articles"),
  ]);

  return (
    <AppPage>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          icon={PenLine}
          label="Author workspace"
          title="Write articles"
          description="Continue your drafts, then pick topics admin assigned to you."
        />

        <Link
          href="/write/standards"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex shrink-0 items-center gap-2 border-white/10 bg-white/[0.02]",
          )}
        >
          <BookOpenCheck className="size-4" />
          Writing standards
        </Link>
      </div>

      <section className="glass-panel p-7 sm:p-8">
        <SectionHeading
          title="Author profile"
          description="Add your LinkedIn so readers can see your credit on published articles."
        />
        <div className="mt-6">
          <LinkedinProfileForm initialUrl={user.linkedinUrl} />
        </div>
      </section>

      <AuthorWorkspace
        topics={topicsData?.topics ?? []}
        writtenBy={articlesData?.writtenBy ?? []}
        editedBy={articlesData?.editedBy ?? []}
      />
    </AppPage>
  );
}
