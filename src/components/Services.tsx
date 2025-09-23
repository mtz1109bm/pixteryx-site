import { motion } from "framer-motion";
import { Brain, Camera, LineChart, Code } from "lucide-react";
import { brand } from "../brand";
import { Link } from "react-router-dom";
import type { JSX } from "react";

function ServiceCard({ to, icon, title, desc }: { to: string; icon: JSX.Element; title: string; desc: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }}>
      <Link to={to} className={`block rounded-2xl p-6 border border-white/10 ${brand.card} hover:border-sky-400/50`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10">{icon}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="mt-3 text-slate-400">{desc}</p>
      </Link>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className={`${brand.bg} ${brand.text} min-h-screen w-full snap-start flex items-center`} style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold">Nos services</h2>
        <p className={`mt-2 ${brand.sub}`}>Du prototype au déploiement en production.</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard to="/services/ia-ml" icon={<Brain className="text-sky-400" />} title="IA & ML" desc="Modèles, MLOps, mise en prod." />
          <ServiceCard to="/services/vision" icon={<Camera className="text-sky-400" />} title="Vision par ordinateur" desc="Détection/segmentation, OCR, 2D/3D." />
          <ServiceCard to="/services/data-analytics" icon={<LineChart className="text-sky-400" />} title="Data Analytics" desc="Pipelines & dashboards décisionnels." />
          <ServiceCard to="/services/dev-web-mobile" icon={<Code className="text-sky-400" />} title="Dev Web & Mobile" desc="Apps React/Flutter, APIs, cloud." />
          <ServiceCard to="/services/signal" icon={<Code className="text-sky-400" />} title="Traitement du signal" desc="Séries temporelles, temps réel, edge." />
          <ServiceCard to="/services/conseil-audit" icon={<LineChart className="text-sky-400" />} title="Conseil & Audit" desc="Cadrage, roadmap, accompagnement." />
        </div>
      </div>
    </section>
  );
}
