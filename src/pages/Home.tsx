import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { About } from "../components/About";
import Contact from "./Contact";
import { CTASection } from "../components/CTASection";

export default function Home({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  return (
    <>
      {/* ✅ React 19: metadata native */}
      <title>Pixteryx — IA, Data & Vision</title>
      <link rel="canonical" href="https://www.pixteryx.fr/" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Pixteryx",
          url: "https://www.pixteryx.fr/",
          logo: "https://www.pixteryx.fr/icon-512.png",
          sameAs: ["https://www.linkedin.com/company/pixteryx"],
        })}
      </script>

      <Hero />
      <Services />
      <About />
      <Contact onOpenPrivacy={onOpenPrivacy} />
      <CTASection />
    </>
  );
}
