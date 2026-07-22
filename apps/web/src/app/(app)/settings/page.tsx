import Link from "next/link";
import { Bug, Mail, Settings, User } from "lucide-react";

import { LinkedinProfileForm } from "@/components/author/linkedin-profile-form";
import { AppPage } from "@/components/ui/app-page";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionHeading } from "@/components/ui/section-heading";
import { isEditorOrAdmin, requireUser } from "@/lib/auth-server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <AppPage size="narrow">
      <PageIntro
        icon={Settings}
        label="Account"
        title="Settings"
        description="Manage your profile, author details, and account preferences."
      />

      <section className="glass-panel p-7 sm:p-8">
        <SectionHeading icon={User} title="Profile" />

        <div className="mt-7 space-y-0 divide-y divide-white/[0.06]">
          {[
            { label: "Name", value: user.name || "Not set" },
            { label: "Email", value: user.email },
          ].map((field) => (
            <div key={field.label} className="py-5 first:pt-0 last:pb-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {field.label}
              </p>
              <p className="mt-2 font-medium">{field.value}</p>
            </div>
          ))}
          <div className="py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Role
            </p>
            <Badge className="mt-2.5 border-0 bg-gold-muted px-3 py-1 text-xs font-medium text-gold">
              {user.role}
            </Badge>
          </div>
        </div>
      </section>

      {isEditorOrAdmin(user) && (
        <section className="glass-panel p-7 sm:p-8">
          <SectionHeading
            title="Author profile"
            description="Your LinkedIn link appears on published article credits — permanently, even if your account status changes later."
          />
          <div className="mt-6">
            <LinkedinProfileForm initialUrl={user.linkedinUrl} />
          </div>
        </section>
      )}

      <section className="glass-panel p-7 sm:p-8">
        <SectionHeading
          title="Help & feedback"
          description="Contact the team or report a problem you found in the app."
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/10 bg-white/[0.03]",
            )}
          >
            <Mail className="size-4 text-primary" />
            Contact us
          </Link>
          <Link
            href="/report-bug"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/10 bg-white/[0.03]",
            )}
          >
            <Bug className="size-4 text-primary" />
            Report a bug
          </Link>
        </div>
      </section>
    </AppPage>
  );
}
