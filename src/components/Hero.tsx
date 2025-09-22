import { motion } from "framer-motion";
import { ArrowRight, Brain, Camera, Code, LineChart, ChevronDown } from "lucide-react";
import { brand } from "../brand";
import { PixteryxLogo } from "./Logo";
import { track } from "../lib/analytics.ts"; 

export function Hero() {
  return (
    <section id="top" className={`${brand.bg} ${brand.text} min-h-screen w-full snap-start flex items-center relative overflow-hidden`}>
      <div className="pointer-events-none absolute right-0 top-1/4 translate-x-1/4 w-[45vw] max-w-[700px] aspect-square rounded-full bg-sky-500/20 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs ${brand.sub}`}>
            <span className="text-sky-400">IA • Data • Vision</span>
            <span className="text-slate-500">par Pixteryx</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
            Transformer les <span className="text-sky-400">données</span> en <span className="text-sky-400">décisions</span>.
          </h1>
          <p className="mt-4 text-slate-400 max-w-prose">
            Solutions modernes en data, IA, vision par ordinateur et développement web/mobile. Fiables, performantes et durables — pour startups, PME et secteur public.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
          
            <a 
            href="#contact" 
            onClick={() => track("cta_contact_click", { location: "hero" })}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-slate-900 font-semibold hover:brightness-110"
            >
              Discuter de votre projet <ArrowRight size={18} />
            </a>

            <a 
            href="#services" 
            onClick={() => track("cta_services_click", { location: "hero" })}    
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50"
            >
              Voir nos services
            </a>
          </div>
        </motion.div>

            


        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="justify-self-center">
          <div className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/60 shadow-xl">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-sky-500/10 blur-2xl" />
            <div className="flex items-center gap-4">
              <PixteryxLogo size={56} />
              <div><p className="text-slate-400">Entreprise</p><h3 className="text-2xl font-semibold">Pixteryx</h3></div>
            </div>
            <ul className="mt-6 space-y-2 text-slate-300">
              <li className="flex items-center gap-2"><Brain /> IA & Machine Learning</li>
              <li className="flex items-center gap-2"><Camera /> Vision par ordinateur</li>
              <li className="flex items-center gap-2"><LineChart /> Analyse avancée de données</li>
              <li className="flex items-center gap-2"><Code /> Développement web & mobile</li>
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <a
        href="#services"
        onClick={() => track("jump_to_services", { location: "hero_fab" })}
        aria-label="Section suivante"
        className="group inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur hover:border-sky-400/60 hover:bg-slate-900/70 transition-colors"
        >
        <ChevronDown className="transition-transform group-hover:translate-y-0.5" />
        </a>

      </div>
    </section>
  );
}
