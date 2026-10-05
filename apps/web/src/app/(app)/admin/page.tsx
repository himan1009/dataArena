import Link from "next/link";
import { Shield } from "lucide-react";

import { AppPage } from "@/components/ui/app-page";
import { IconBox } from "@/components/ui/icon-box";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { adminHubLinks } from "@/config/admin-navigation";
import { requireAdmin } from "@/lib/auth-server";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  await requireAdmin();

  return (
    <AppPage>
      <PageIntro
        icon={Shield}
        label="Admin CMS"
        title="Content management"
        description="Manage articles, practice, short videos (YouTube embeds), reviews, writers, and users."
      />

      <section className="grid gap-5 sm:grid-cols-2">
        {adminHubLinks.map((link) => (
          <div key={link.href} className="glass-panel flex flex-col p-7 sm:p-8">
            <IconBox icon={link.icon} size="md" />
            <h3 className="mt-6 text-lg font-semibold tracking-tight">{link.title}</h3>
            <p className="mt-2 flex-1 text-[15px] leading-7 text-muted-foreground">
              {link.description}
            </p>
            <Link
              href={link.href}
              className={cn(buttonVariants(), "mt-6 w-fit")}
            >
              Open {link.title.toLowerCase()}
            </Link>
          </div>
        ))}
      </section>
    </AppPage>
  );
}
