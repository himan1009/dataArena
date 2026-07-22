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

export const metadata = {
  title: "DataArena — Learn data engineering in one workspace",
  description:
    "Notes, practice labs, interview prep, and AI for data engineers — in one platform.",
};

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
