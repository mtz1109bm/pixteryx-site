import { Phone, Mail } from "lucide-react";
import { track } from "../lib/analytics";

export function StickyActions() {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden">
      <div className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur px-3 py-2 shadow-lg">
        <a
          href="tel:+33766705330"
          onClick={() => track("phone_click", { location: "sticky" })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-sky-400/50"
        >
          <Phone size={16}/> Appeler
        </a>
        <a
          href="mailto:contact@pixteryx.fr"
          onClick={() => track("email_click", { location: "sticky" })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-slate-900 font-semibold hover:brightness-110"
        >
          <Mail size={16}/> Écrire
        </a>
      </div>
    </div>
  );
}
