import { brand } from "../brand";

export function About() {
  return (
    <section id="about" className={`${brand.bg} ${brand.text} min-h-screen w-full snap-start flex items-center`}style={{ contentVisibility: "auto", containIntrinsicSize: "1px 800px" }}>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">À propos</h2>
          <p className="mt-4 text-slate-400">
            Pixteryx est spécialisée dans l’analyse de données, l’IA et la vision par ordinateur. Nous aidons startups, PME et institutions à créer des solutions sur mesure, robustes et pérennes. Notre approche : innovation, fiabilité, performance et durabilité.
          </p>
          <p className="mt-3 text-slate-400">
            Expertise : traitement du signal & d’images, apprentissage automatique, développement web/mobile. Nous transformons vos données en décisions à impact.
          </p>
        </div>
        <div className={`rounded-3xl border border-white/10 p-6 ${brand.card}`}>
          <h3 className="text-xl font-semibold">Nos valeurs</h3>
          <ul className="mt-3 space-y-2 text-slate-300 list-disc list-inside">
            <li>Innovation continue</li>
            <li>Fiabilité et qualité de livraison</li>
            <li>Performance mesurable</li>
            <li>Durabilité et responsabilité</li>
          </ul>
          <div className="mt-6">
            <h4 className="font-semibold">Devise</h4>
            <p className={`${brand.sub}`}>« La puissance des données, la précision de la vision. »</p>
          </div>
        </div>
      </div>
    </section>
  );
}
