import Link from "next/link";
import { Bug, Mail, Settings, User } from "lucide-react";

import { LinkedinProfileForm } from "@/components/author/linkedin-profile-form";
import { Badge } from "@/components/ui/badge";
import { IconBox } from "@/components/ui/icon-box";
import { PageHeader } from "@/components/ui/section-header";
import { requireUser } from "@/lib/auth-server";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-10 sm:space-y-12">
      <div className="flex items-start gap-5">
        <IconBox icon={Settings} size="lg" className="hidden sm:flex" />
        <PageHeader
          label="Account"
          title="Settings"
          description="Manage your profile, author details, and account preferences."
        />
      </div>

      <section className="glass-panel p-7 sm:p-8">
        <div className="mb-7 flex items-center gap-4">
          <IconBox icon={User} size="sm" />
          <h3 className="text-lg font-semibold tracking-tight">Profile</h3>
        </div>

        <div className="space-y-0 divide-y divide-white/[0.06]">
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

      {(user.role === "EDITOR" || user.role === "ADMIN") && (
        <section className="glass-panel p-7 sm:p-8">
          <h3 className="text-lg font-semibold tracking-tight">Author profile</h3>
          <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
            Your LinkedIn link appears on published article credits — permanently,
            even if your account status changes later.
          </p>
          <div className="mt-6">
            <LinkedinProfileForm initialUrl={user.linkedinUrl} />
          </div>
        </section>
      )}

      <section className="glass-panel p-7 sm:p-8">
        <h3 className="text-lg font-semibold tracking-tight">Help & feedback</h3>
        <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
          Contact the team or report a problem you found in the app.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium hover:bg-white/[0.06]"
          >
            <Mail className="size-4 text-primary" />
            Contact us
          </Link>
          <Link
            href="/report-bug"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium hover:bg-white/[0.06]"
          >
            <Bug className="size-4 text-primary" />
            Report a bug
          </Link>
        </div>
      </section>
    </div>
  );
}
