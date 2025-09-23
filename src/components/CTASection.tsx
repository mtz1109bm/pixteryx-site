import { ArrowRight, Calendar } from "lucide-react";
import { brand } from "../brand";
import { track } from "../lib/analytics";

export function CTASection() {
  return (
    <section className={`${brand.bg} ${brand.text} py-16 border-t border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 rounded-3xl border border-white/10 p-8 bg-slate-900/40">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Un projet en tête ?</h2>
            <p className={`mt-2 ${brand.sub}`}>Planifions un échange de 30 minutes pour cadrer votre besoin.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="https://calendly.com/pixteryx/30min"
              target="_blank" rel="noreferrer"
              onClick={() => track("cta_calendly_click", { location: "cta_section" })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-slate-900 font-semibold hover:brightness-110"
            >
              <Calendar size={18}/> Réserver un RDV
            </a>
            <a
              href="/#contact"
              onClick={() => track("cta_contact_scroll", { location: "cta_section" })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50"
            >
              Nous écrire <ArrowRight size={18}/>
            </a>
            <a href="/devis-rapide" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50">
            Estimer mon budget <ArrowRight size={18}/>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
