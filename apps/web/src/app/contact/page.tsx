import { ContactForm } from "@/components/feedback/contact-form";
import { SupportPageShell } from "@/components/feedback/support-page-shell";
import { PageIntro } from "@/components/ui/page-intro";
import { getCurrentUser } from "@/lib/auth-server";
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
        <PageIntro
          icon={Mail}
          label="Contact"
          title="Get in touch"
          headingLevel={user ? "h2" : "h1"}
          description="Questions, partnerships, or feedback — send us a message and we will reply to your email."
        />

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
