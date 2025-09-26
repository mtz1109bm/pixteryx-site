import { writeFileSync } from "node:fs";

const base = "https://www.pixteryx.fr";

// ✅ Ajoute/retire des routes selon ton router réel
const routes = [
  "/",               // Accueil
  "/devis-rapide",   // Devis
  "/faq"             // FAQ (si tu la déploies maintenant)
];

const now = new Date().toISOString();
const urls = routes.map((p) => `
  <url>
    <loc>${base}${p}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === "/" ? "1.0" : "0.7"}</priority>
  </url>`).join("");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

writeFileSync("public/sitemap.xml", xml.trim(), "utf8");
console.log("✓ sitemap.xml generated");
