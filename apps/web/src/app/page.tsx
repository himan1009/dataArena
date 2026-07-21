import { MeshBackground } from "@/components/ui/mesh-background";
import { getCurrentUser } from "@/lib/auth-server";
import {
  CTA,
  Features,
  Footer,
  Hero,
  LegalNotice,
  Navbar,
  Principles,
  Roadmap,
} from "@/components/landing";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <>
      <MeshBackground />
      <Navbar user={user} />
      <main>
        <Hero user={user} />
        <Features />
        <Principles />
        <Roadmap />
        <CTA user={user} />
        <LegalNotice />
      </main>
      <Footer user={user} />
    </>
  );
}
