import { brand } from "../brand";
import { Shield, FileText, Scale, Cookie, Globe } from "lucide-react";

export default function PrivacyContent() {
  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><Shield className="text-sky-400" /> Politique de confidentialité</h2>
        <ul className="mt-4 grid md:grid-cols-2 gap-2 text-slate-300 text-sm">
          <li>Respect du RGPD</li><li>Contact : contact@pixteryx.fr</li><li>Pas de revente de données</li><li>Conservation jusqu’à 3 ans</li>
        </ul>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><FileText className="text-sky-400" /> Données collectées</h3>
        <p className="mt-2 text-slate-300">Via le formulaire de contact : nom, adresse e-mail, contenu du message. Finalités : répondre à vos demandes et assurer le suivi commercial. Base légale : intérêts légitimes et mesures précontractuelles.</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><Globe className="text-sky-400" /> Destinataires & hébergement</h3>
        <p className="mt-2 text-slate-300">Les données sont traitées par Pixteryx et hébergées chez nos prestataires (hébergeur web/Vercel, outil de formulaire le cas échéant). Nous ne revendons pas vos données.</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><FileText className="text-sky-400" /> Durées de conservation</h3>
        <p className="mt-2 text-slate-300">Jusqu’à 3 ans après le dernier contact à des fins de prospection, sauf obligation légale différente.</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><Scale className="text-sky-400" /> Vos droits</h3>
        <p className="mt-2 text-slate-300">Vous disposez des droits d’accès, rectification, effacement, opposition, limitation et portabilité. Pour les exercer : <a href="mailto:contact@pixteryx.fr" className="underline">contact@pixteryx.fr</a>. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).</p>
      </div>

      <div className={`rounded-2xl border border-white/10 p-6 ${brand.card}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2"><Cookie className="text-sky-400" /> Cookies</h3>
        <p className="mt-2 text-slate-300">Par défaut, nous n’utilisons pas de cookies de suivi. Si des outils d’analyse sont ajoutés, une bannière d’information et un paramétrage des consentements seront mis en place.</p>
        <p className="text-xs text-slate-500 mt-4">Dernière mise à jour : 21/09/2025.</p>
      </div>
    </div>
  );
}
