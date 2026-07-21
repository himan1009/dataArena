import { getCurrentUser } from "@/lib/auth-server";
import { ContactForm } from "@/components/feedback/contact-form";
import { SupportPageShell } from "@/components/feedback/support-page-shell";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the DataArena team.",
};

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <SupportPageShell user={user}>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-white/[0.03]">
            <Mail className="size-5 text-primary" />
          </div>
          <div>
            <p className="section-label">Contact</p>
            <h1 className="text-3xl font-semibold tracking-tight">Get in touch</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Questions, partnerships, or feedback — send us a message and we will reply
              to your email.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8">
          <ContactForm
            defaultName={user?.name ?? ""}
            defaultEmail={user?.email ?? ""}
          />
        </div>
      </div>
    </SupportPageShell>
  );
}
