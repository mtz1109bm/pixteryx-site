import { brand } from "../brand";
import { Link } from "react-router-dom";

export default function ServerError() {
  return (
    <section className={`${brand.bg} ${brand.text} min-h-screen flex items-center`}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
          Erreur 500
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold">Ce n’est pas vous, c’est nous.</h1>
        <p className="mt-3 text-slate-400">Un souci technique est survenu. Réessayez dans un instant.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/" className="px-5 py-3 rounded-xl bg-sky-500 text-slate-900 font-semibold">← Accueil</Link>
          <a href="mailto:contact@pixteryx.fr" className="px-5 py-3 rounded-xl border border-white/10">Nous écrire</a>
        </div>
      </div>
    </section>
  );
}
