import { AppShell } from "@/components/app/app-shell";
import { Footer, Navbar } from "@/components/landing";
import { MeshBackground } from "@/components/ui/mesh-background";
import { PageContainer } from "@/components/ui/page-container";
import type { AuthUser } from "@/lib/api";

export function SupportPageShell({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  if (user) {
    return <AppShell user={user}>{children}</AppShell>;
  }

  return (
    <>
      <MeshBackground />
      <Navbar user={null} />
      <main className="py-16 sm:py-20">
        <PageContainer size="narrow">{children}</PageContainer>
      </main>
      <Footer user={null} />
    </>
  );
}
