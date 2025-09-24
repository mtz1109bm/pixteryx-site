import { brand } from "../brand";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className={`${brand.bg} ${brand.text} min-h-screen flex items-center`}>
      <title>Pixteryx — Page introuvable</title>
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Page introuvable</h1>
        <p className="mt-2 text-slate-400">La ressource demandée n’existe pas.</p>
        <div className="mt-6">
          <Link to="/" className="inline-block px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50">← Retour à l’accueil</Link>
        </div>
      </div>
    </section>
  );
}
