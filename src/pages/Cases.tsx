import { brand } from "../brand";
import { Link } from "react-router-dom";

export const CASES = [
  {
    slug: "inspection-qualite-vision",
    title: "Inspection qualité par vision",
    summary: "Détection de défauts sur ligne de production (taux d’erreur ↓ 78%).",
    tags: ["Vision", "Industrie", "Edge"],
  },
  {
    slug: "forecast-demande-ml",
    title: "Prévision de la demande (ML)",
    summary: "Amélioration de la précision de 22% vs baseline statistique.",
    tags: ["ML", "Retail", "Time-series"],
  },
];

export default function Cases() {
  return (
    <section className={`${brand.bg} ${brand.text} min-h-screen py-16`}>
      <title>Pixteryx — Études de cas</title>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold">Études de cas</h1>
        <p className={`mt-2 ${brand.sub}`}>Quelques exemples concrets de nos réalisations.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {CASES.map(c => (
            <Link key={c.slug} to={`/cases/${c.slug}`} className="rounded-2xl border border-white/10 p-6 bg-slate-900/40 hover:border-sky-400/50">
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-slate-300">{c.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.tags.map(t => <span key={t} className="text-xs px-2 py-1 rounded-full border border-white/10">{t}</span>)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
