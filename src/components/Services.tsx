import { motion } from "framer-motion";
import { Brain, Camera, LineChart, Code } from "lucide-react";
import { brand } from "../brand";
import type { JSX } from "react";

function ServiceCard({ icon, title, desc }: { icon: JSX.Element; title: string; desc: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }} className={`rounded-2xl p-6 border border-white/10 ${brand.card}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-sky-500/10">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-slate-400">{desc}</p>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className={`${brand.bg} ${brand.text} min-h-screen w-full snap-start flex items-center`}>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold">Nos services</h2>
        <p className={`mt-2 ${brand.sub}`}>Du prototype au déploiement en production.</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard icon={<Brain className="text-sky-400" />} title="IA & ML" desc="Modèles de classification, régression, NLP et deep learning. Mise en production fiable (MLOps)." />
          <ServiceCard icon={<Camera className="text-sky-400" />} title="Vision par ordinateur" desc="Détection/segmentation, OCR, inspection qualité, traitement d'images 2D/3D." />
          <ServiceCard icon={<LineChart className="text-sky-400" />} title="Data Analytics" desc="Pipeline de données, feature engineering, dashboards décisionnels." />
          <ServiceCard icon={<Code className="text-sky-400" />} title="Dev Web & Mobile" desc="Apps sur mesure en React / Flutter, APIs performantes, intégrations cloud." />
          <ServiceCard icon={<Code className="text-sky-400" />} title="Traitement du signal" desc="Filtrage, time-series, audio/EEG/IoT, optimisation temps réel." />
          <ServiceCard icon={<LineChart className="text-sky-400" />} title="Conseil & Audit" desc="Stratégie data/IA, cadrage, roadmap, accompagnement d'équipes." />
        </div>
      </div>
    </section>
  );
}
