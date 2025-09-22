import { brand } from "../brand";
import { ScrollText, FileText, Scale, Globe, Shield, AlertCircle } from "lucide-react";

export default function MentionsContent() {
  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><ScrollText className="text-sky-400" /> Mentions légales</h2>
        <ul className="mt-4 grid md:grid-cols-2 gap-2 text-slate-300 text-sm">
          <li><strong>Éditeur :</strong> Pixteryx (SASU)</li>
          <li><strong>Adresse :</strong> 143 Grande Rue Saint Michel, 31400 Toulouse</li>
          <li><strong>Tél :</strong> 07 66 70 53 30</li>
          <li><strong>E-mail :</strong> contact@pixteryx.fr</li>
        </ul>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><FileText className="text-sky-400" /> Éditeur</h3>
        <p className="mt-2 text-slate-300">Pixteryx (SASU). Adresse : 143 Grande Rue Saint Michel, 31400 Toulouse, France. Tél. : 07 66 70 53 30. E-mail : <a href="mailto:contact@pixteryx.fr" className="underline">contact@pixteryx.fr</a>.</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><Scale className="text-sky-400" /> Directeur de la publication</h3>
        <p className="mt-2 text-slate-300">[Nom du dirigeant].</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><FileText className="text-sky-400" /> Immatriculation</h3>
        <p className="mt-2 text-slate-300">SIREN/SIRET : [à compléter]. RCS : [Ville et numéro]. Capital social : [€].</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><Globe className="text-sky-400" /> Hébergement</h3>
        <p className="mt-2 text-slate-300">Vercel Inc. (vercel.com).</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><Shield className="text-sky-400" /> Propriété intellectuelle</h3>
        <p className="mt-2 text-slate-300">Le contenu du site (textes, logos, éléments graphiques) est la propriété de Pixteryx ou de ses partenaires. Toute reproduction non autorisée est interdite.</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><AlertCircle className="text-sky-400" /> Responsabilité</h3>
        <p className="mt-2 text-slate-300">Pixteryx s’efforce d’assurer l’exactitude des informations publiées mais ne saurait être tenue responsable des erreurs ou omissions.</p>
        <p className={`mt-4 text-xs ${brand.sub}`}>Dernière mise à jour : 21/09/2025.</p>
      </div>
    </div>
  );
}
