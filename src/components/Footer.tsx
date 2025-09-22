import { brand } from "../brand";
import { PixteryxLogo } from "./Logo";
import { Shield, ScrollText } from "lucide-react";

export function Footer({ onOpenMentions, onOpenPrivacy }: { onOpenMentions: () => void; onOpenPrivacy: () => void }) {
  return (
    <footer role="contentinfo" className={`${brand.bg} ${brand.text} border-t border-white/10`}>
      <div className={`max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm ${brand.sub}`}>
        <div className="flex items-center gap-2">
          <PixteryxLogo size={20} wordmark={false} /> <span>© {new Date().getFullYear()} Pixteryx. Tous droits réservés.</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            id="open-mentions-footer"
            aria-haspopup="dialog"
            aria-controls="modal-mentions"
            onClick={onOpenMentions}
            className="hover:text-sky-300 inline-flex items-center gap-1"
          >
            <ScrollText size={16} /> Mentions légales
          </button>
          <button
            id="open-privacy-footer"
            aria-haspopup="dialog"
            aria-controls="modal-privacy"
            onClick={onOpenPrivacy}
            className="hover:text-sky-300 inline-flex items-center gap-1"
          >
            <Shield size={16} /> Politique de confidentialité
          </button>
        </div>
      </div>
    </footer>
  );
}

