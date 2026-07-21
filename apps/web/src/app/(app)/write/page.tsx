import { redirect } from "next/navigation";
import { PenLine } from "lucide-react";

import { AuthorWorkspace } from "@/components/author/author-workspace";
import { LinkedinProfileForm } from "@/components/author/linkedin-profile-form";
import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { requireUser } from "@/lib/auth-server";
import { getBackendUrl } from "@/lib/proxy";

export const metadata = {
  title: "Write",
};

async function fetchAuthorData(path: string, cookieHeader: string) {
  const response = await fetch(getBackendUrl(`/notes${path}`), {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function WritePage() {
  const user = await requireUser();

  if (user.role !== "EDITOR" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const cookieStore = await import("next/headers").then((mod) => mod.cookies());
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const [topicsData, articlesData] = await Promise.all([
    fetchAuthorData("/author/topics/available", cookieHeader),
    fetchAuthorData("/author/articles", cookieHeader),
  ]);

  return (
    <div className="space-y-12 sm:space-y-14">
      <div className="flex items-start gap-5">
        <IconBox icon={PenLine} size="lg" className="hidden sm:flex" />
        <PageHeader
          label="Author workspace"
          title="Write articles"
          description="Pick a topic, write with the visual editor, and submit for admin review."
        />
      </div>

      <section className="glass-panel p-7 sm:p-8">
        <h3 className="text-lg font-semibold tracking-tight">Author profile</h3>
        <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
          Add your LinkedIn so readers can see your credit on published articles.
        </p>
        <div className="mt-5">
          <LinkedinProfileForm initialUrl={user.linkedinUrl} />
        </div>
      </section>

      <AuthorWorkspace
        topics={topicsData?.topics ?? []}
        writtenBy={articlesData?.writtenBy ?? []}
        editedBy={articlesData?.editedBy ?? []}
      />
    </div>
  );
}
