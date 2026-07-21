import { Footer, Navbar } from "@/components/landing";
import { MeshBackground } from "@/components/ui/mesh-background";
import { PageContainer } from "@/components/ui/page-container";
import { getCurrentUser } from "@/lib/auth-server";

export async function MarketingPageShell({
  children,
  size = "narrow",
}: {
  children: React.ReactNode;
  size?: "default" | "narrow" | "wide";
}) {
  const user = await getCurrentUser();

  return (
    <>
      <MeshBackground />
      <Navbar user={user} />
      <main className="py-16 sm:py-20">
        <PageContainer size={size}>{children}</PageContainer>
      </main>
      <Footer user={user} />
    </>
  );
}
