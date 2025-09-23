import { brand } from "../brand";
import { Link, useParams } from "react-router-dom";
import { CASES } from "./Cases";

export default function CaseDetail() {
  const { slug } = useParams<{slug: string}>();
  const c = CASES.find(x => x.slug === slug);

  if (!c) {
    return (
      <section className={`${brand.bg} ${brand.text} min-h-screen flex items-center`}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Étude de cas introuvable</h1>
          <Link to="/cases" className="underline mt-4 inline-block">← Retour</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`${brand.bg} ${brand.text} min-h-screen py-16`}>
      <title>{`Pixteryx — ${c.title}`}</title>
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold">{c.title}</h1>
        <p className={`mt-2 ${brand.sub}`}>{c.summary}</p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-white/10 p-6 bg-slate-900/40">
            <h3 className="font-semibold">Contexte</h3>
            <p className="text-slate-300 mt-1">[Décrire le client, son secteur, son enjeu métier…]</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-6 bg-slate-900/40">
            <h3 className="font-semibold">Solution</h3>
            <p className="text-slate-300 mt-1">[Approche technique, stack, modèles, pipeline…]</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-6 bg-slate-900/40">
            <h3 className="font-semibold">Résultats</h3>
            <ul className="mt-2 list-disc list-inside text-slate-300">
              <li>Indicateur clé 1…</li>
              <li>Indicateur clé 2…</li>
              <li>Indicateur clé 3…</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/cases" className="underline">← Retour</Link>
        </div>
      </div>
    </section>
  );
}
