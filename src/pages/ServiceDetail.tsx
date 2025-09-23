import { brand } from "../brand";
import { Brain, Camera, LineChart, Code } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { track } from "../lib/analytics";
import type { JSX } from "react";

const SERVICES: Record<string, {
  title: string;
  icon: JSX.Element;
  intro: string;
  bullets: string[];
  og?: string;
}> = {
  "ia-ml": {
    title: "IA & Machine Learning",
    icon: <Brain className="text-sky-400" />,
    intro: "Modèles de classification, régression, NLP et deep learning. MLOps pour la mise en production fiable.",
    bullets: [
      "Conception de modèles (tabulaire, texte, image)",
      "Fine-tuning & évaluation",
      "Mise en production (API, batch, streaming)",
      "Surveillance & drift",
    ],
  },
  "vision": {
    title: "Vision par ordinateur",
    icon: <Camera className="text-sky-400" />,
    intro: "Détection/segmentation, OCR, inspection qualité, traitement 2D/3D.",
    bullets: ["Datasets & annotation", "Détection/Segmentation", "OCR & lecture de documents", "Optimisation temps réel (edge/CPU)"],
  },
  "data-analytics": {
    title: "Data Analytics",
    icon: <LineChart className="text-sky-400" />,
    intro: "Pipelines de données et dashboards décisionnels, de l’ingestion au reporting.",
    bullets: ["Ingestion & transformation", "Feature engineering", "BI & KPI", "Qualité & gouvernance"],
  },
  "dev-web-mobile": {
    title: "Développement Web & Mobile",
    icon: <Code className="text-sky-400" />,
    intro: "Applications sur mesure (React/Flutter), APIs performantes, intégrations cloud.",
    bullets: ["Front-end performant", "APIs robustes", "Intégration CI/CD", "Observabilité"],
  },
  "signal": {
    title: "Traitement du signal",
    icon: <Code className="text-sky-400" />,
    intro: "Filtrage, séries temporelles, audio/EEG/IoT, optimisation embarquée.",
    bullets: ["DSP & filtrage", "Forecasting & anomalies", "Audio/EEG", "Edge & temps réel"],
  },
  "conseil-audit": {
    title: "Conseil & Audit",
    icon: <LineChart className="text-sky-400" />,
    intro: "Cadrage stratégique, roadmap data/IA, accompagnement d’équipes.",
    bullets: ["État des lieux & risques", "Roadmap priorisée", "PoC → Prod", "Transfert de compétences"],
  },
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const svc = slug ? SERVICES[slug] : undefined;

  if (!svc) {
    return (
      <section className={`${brand.bg} ${brand.text} min-h-screen flex items-center`}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Service introuvable</h1>
          <p className={`mt-2 ${brand.sub}`}>La page demandée n’existe pas.</p>
          <Link to="/" className="inline-block mt-6 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50">Retour à l’accueil</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`${brand.bg} ${brand.text} min-h-screen py-16`}>
      {/* ✅ Meta natifs */}
      <title>{`Pixteryx — ${svc.title}`}</title>
      <link rel="canonical" href={`https://www.pixteryx.fr/services/${slug}`} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          provider: { "@type": "Organization", name: "Pixteryx" },
          name: svc.title,
          areaServed: "FR",
        })}
      </script>

      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3">
          {svc.icon}
          <h1 className="text-3xl md:text-4xl font-bold">{svc.title}</h1>
        </div>
        <p className={`mt-3 ${brand.sub}`}>{svc.intro}</p>

        <ul className="mt-6 grid md:grid-cols-2 gap-3">
          {svc.bullets.map((b) => (
            <li key={b} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">{b}</li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://calendly.com/pixteryx/30min"
            target="_blank" rel="noreferrer"
            onClick={() => track("cta_calendly_click", { location: "service_detail", service: slug })}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-slate-900 font-semibold hover:brightness-110"
          >
            Parler à un expert
          </a>
          <Link
            to="/#contact"
            onClick={() => track("cta_contact_scroll", { location: "service_detail", service: slug })}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50"
          >
            Nous écrire
          </Link>
        </div>

        <div className="mt-10">
          <Link to="/" className="underline">← Retour</Link>
        </div>
      </div>
    </section>
  );
}
