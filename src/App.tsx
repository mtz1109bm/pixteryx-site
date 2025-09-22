import { brand } from "./brand";
import Quote from "./pages/Quote";
import FAQ from "./pages/FAQ";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { LegalModal } from "./components/LegalModal";
import { Shield, ScrollText } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ServiceDetail from "./pages/ServiceDetail";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import { StickyActions } from "./components/StickyActions";

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
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(56,189,248,.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden={openMentions || openPrivacy ? true : undefined}
      >
        <a href="#main" className="skip-link">Aller au contenu principal</a>
        <NavBar />

        <Routes>
          <Route path="/" element={<Home onOpenPrivacy={() => setOpenPrivacy(true)} />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:slug" element={<CaseDetail />} />
          <Route path="/devis-rapide" element={<Quote />} />
          <Route path="/faq" element={<FAQ />} />
          {/* fallback simple (retour home) */}
          <Route path="*" element={<Home onOpenPrivacy={() => setOpenPrivacy(true)} />} />
        </Routes>

        <Footer
          onOpenMentions={() => setOpenMentions(true)}
          onOpenPrivacy={() => setOpenPrivacy(true)}
        />
      </main>

      {/* Barre d’actions mobile */}
      <StickyActions />

      {openMentions && (
        <Suspense
          fallback={
            <LegalModal id="modal-mentions" open onClose={() => setOpenMentions(false)} title="Mentions légales" icon={<ScrollText className="text-sky-400" />}>
              <div className="text-slate-400 p-6">Chargement…</div>
            </LegalModal>
          }
        >
          <LegalModal id="modal-mentions" open onClose={() => setOpenMentions(false)} title="Mentions légales" icon={<ScrollText className="text-sky-400" />}>
            <MentionsContent />
          </LegalModal>
        </Suspense>
      )}

      {openPrivacy && (
        <Suspense
          fallback={
            <LegalModal id="modal-privacy" open onClose={() => setOpenPrivacy(false)} title="Politique de confidentialité" icon={<Shield className="text-sky-400" />}>
              <div className="text-slate-400 p-6">Chargement…</div>
            </LegalModal>
          }
        >
          <LegalModal id="modal-privacy" open onClose={() => setOpenPrivacy(false)} title="Politique de confidentialité" icon={<Shield className="text-sky-400" />}>
            <PrivacyContent />
          </LegalModal>
        </Suspense>
      )}
    </>
  );
}
