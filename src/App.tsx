import { brand } from "./brand";
import { NavBar } from "./components/NavBar";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import Contact from "./pages/Contact";
import { Footer } from "./components/Footer";
import { LegalModal } from "./components/LegalModal";
import { Shield, ScrollText } from "lucide-react";
import { useState, lazy, Suspense } from "react";

const MentionsContent = lazy(() => import("./pages/MentionsContent"));
const PrivacyContent = lazy(() => import("./pages/PrivacyContent"));

export default function App() {
  const [openMentions, setOpenMentions] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  return (
    <>
      <main
        id="main"
        role="main"
        className={`${brand.bg} ${brand.text} h-screen overflow-y-auto overflow-x-hidden overscroll-y-contain snap-y snap-proximity`}
        style={{
          scrollbarGutter: "stable both-edges",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(56,189,248,.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden={openMentions || openPrivacy ? true : undefined}
      >
        <a href="#main" className="skip-link">
          Aller au contenu principal
        </a>

        <NavBar />
        <Hero />
        <Services />
        <About />
        <Contact onOpenPrivacy={() => setOpenPrivacy(true)} />
        <Footer
          onOpenMentions={() => setOpenMentions(true)}
          onOpenPrivacy={() => setOpenPrivacy(true)}
        />
      </main>

      {openMentions && (
        <Suspense
          fallback={
            <LegalModal
              id="modal-mentions"
              open
              onClose={() => setOpenMentions(false)}
              title="Mentions légales"
              icon={<ScrollText className="text-sky-400" />}
            >
              <div className="text-slate-400 p-6">Chargement…</div>
            </LegalModal>
          }
        >
          <LegalModal
            id="modal-mentions"
            open
            onClose={() => setOpenMentions(false)}
            title="Mentions légales"
            icon={<ScrollText className="text-sky-400" />}
          >
            <MentionsContent />
          </LegalModal>
        </Suspense>
      )}

      {openPrivacy && (
        <Suspense
          fallback={
            <LegalModal
              id="modal-privacy"
              open
              onClose={() => setOpenPrivacy(false)}
              title="Politique de confidentialité"
              icon={<Shield className="text-sky-400" />}
            >
              <div className="text-slate-400 p-6">Chargement…</div>
            </LegalModal>
          }
        >
          <LegalModal
            id="modal-privacy"
            open
            onClose={() => setOpenPrivacy(false)}
            title="Politique de confidentialité"
            icon={<Shield className="text-sky-400" />}
          >
            <PrivacyContent />
          </LegalModal>
        </Suspense>
      )}
    </>
  );
}
