// api/contact.js
const { limit } = require("../_lib/rateLimit");

module.exports = async function handler(req, res) {
  // --- CORS ---
  const origin = req.headers.origin || "";
  const allowed = [
    process.env.ALLOWED_ORIGIN,
    "https://pixteryx.fr",
    "https://www.pixteryx.fr",
    "http://localhost:5173",
    "http://localhost:5174", // Vite peut changer de port
  ].filter(Boolean);

  const okOrigin = allowed.some((o) => o === "*" || o === origin);
  const setCORS = () => {
    res.setHeader("Access-Control-Allow-Origin", okOrigin ? origin : allowed[0] || "*");
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  };

  if (req.method === "OPTIONS") { setCORS(); res.status(204).end(); return; }
  if (req.method !== "POST") { setCORS(); res.status(405).json({ error: "Method not allowed" }); return; }
  setCORS();

  try {
    // --- Rate limit (IP + UA) ---
    const ip =
      (req.headers["x-forwarded-for"] || "").toString().split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "0.0.0.0";
    const ua = (req.headers["user-agent"] || "").toString().slice(0, 80);
    const rl = await limit(`ip:${ip}|ua:${ua}`);
    res.setHeader("X-RateLimit-Limit", String(rl.limit ?? 5));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, rl.remaining ?? 0)));
    if (!rl.success) return res.status(429).json({ error: "Trop de requêtes, réessayez plus tard." });

    // --- Parse body ---
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const {
      name = "",
      email = "",
      message = "",
      token = "",
      gotcha = "", // honeypot invisible
    } = body;

    // --- Honeypot silencieux ---
    if (gotcha && gotcha.trim() !== "") {
      return res.status(200).json({ ok: true });
    }

    // --- Validations min ---
    const isEmailOk = (em) => {
      const at = em.indexOf("@");
      const dot = em.lastIndexOf(".");
      return at > 0 && dot > at + 1 && dot < em.length - 1;
    };
    if (!name.trim() || !isEmailOk(email) || message.trim().length < 20 || message.length > 1000) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // --- Turnstile (bypass en dev local si pas de secret) ---
    const secret = process.env.TURNSTILE_SECRET_KEY;
    const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");

    if (secret) {
      if (!token) return res.status(400).json({ error: "Captcha required" });

      const vf = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      });
      const data = await vf.json();
      if (!data.success) {
        return res.status(400).json({ error: "Captcha failed", details: data["error-codes"] || [] });
      }
    } else {
      if (!isLocalDev) {
        return res.status(500).json({ error: "Server misconfigured (no Turnstile secret)" });
      }
      // ✅ Local dev sans secret : pas de vérif captcha
    }

    // --- Envoi vers Formspree ---
    const endpoint = process.env.FORMSPREE_CONTACT_ENDPOINT || process.env.FORMSPREE_ENDPOINT;
    if (!endpoint) return res.status(500).json({ error: "No form endpoint configured" });

    const form = new URLSearchParams();
    form.append("name", name);
    form.append("_replyto", email);
    form.append("message", message);
    form.append("_subject", "Nouveau message – pixteryx.fr");

    const fr = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
    });

    if (!fr.ok) {
      const t = await fr.text();
      return res.status(502).json({ error: "Form provider error", details: t.slice(0, 300) });
    }

    return res.status(200).json({ ok: true });
  } catch (_e) {
    return res.status(500).json({ error: "Server error" });
  }
};
