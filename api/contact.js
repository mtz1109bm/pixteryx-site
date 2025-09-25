// api/contact.js
// Robust contact endpoint for Vercel Node functions

// ✅ Rate-limit optionnel (si le fichier n'existe pas en prod, on skip proprement)
let limitFn = null;
try {
  ({ limit: limitFn } = require("../_lib/rateLimit"));
} catch { /* no rate-limit in prod: ok */ }

// --- utils: body parsing safe ---
function safeParse(str) {
  try { return JSON.parse(str); } catch { return {}; }
}
async function readJson(req) {
  try {
    let body = "";
    for await (const chunk of req) body += chunk;
    return safeParse(body);
  } catch { return {}; }
}

module.exports = async function handler(req, res) {
  let STEP = "start";
  const debug = (s) => { STEP = s; };

  // --- CORS (autorise prod + localhost + previews *.vercel.app) ---
  debug("cors");
  const origin = req.headers.origin || "";
  const isVercelPreview = /\.vercel\.app$/.test(origin);
  const allowedList = [
    process.env.ALLOWED_ORIGIN,
    "https://pixteryx.fr",
    "https://www.pixteryx.fr",
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter(Boolean);

  const isAllowed = isVercelPreview || allowedList.includes(origin);
  const setCORS = () => {
    res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin : (allowedList[0] || "*"));
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("X-Debug-Step", STEP);
  };

  if (req.method === "OPTIONS") { setCORS(); return res.status(204).end(); }
  if (req.method !== "POST") { setCORS(); return res.status(405).json({ error: "Method not allowed" }); }
  setCORS();

  try {
    // --- Rate limit (optionnel) ---
    debug("rate-limit");
    if (typeof limitFn === "function") {
      const ip =
        (req.headers["x-forwarded-for"] || "").toString().split(",")[0]?.trim() ||
        req.socket?.remoteAddress || "0.0.0.0";
      const ua = (req.headers["user-agent"] || "").toString().slice(0, 80);
      const rl = await limitFn(`ip:${ip}|ua:${ua}`);
      res.setHeader("X-RateLimit-Limit", String(rl.limit ?? 5));
      res.setHeader("X-RateLimit-Remaining", String(Math.max(0, rl.remaining ?? 0)));
      if (!rl.success) return res.status(429).json({ error: "Trop de requêtes, réessayez plus tard." });
    }

    // --- Parse body (tous cas couverts) ---
    debug("parse-body");
    const body =
      (typeof req.body === "object" && req.body) ||
      (typeof req.body === "string" && req.body.length && safeParse(req.body)) ||
      (await readJson(req)) ||
      {};
    const { name = "", email = "", message = "", token = "", gotcha = "" } = body;

    // --- Honeypot (bots) ---
    debug("honeypot");
    if (gotcha && gotcha.trim() !== "") {
      return res.status(200).json({ ok: true });
    }

    // --- Validations ---
    debug("validate");
    const isEmailOk = (em) => {
      const at = em.indexOf("@"); const dot = em.lastIndexOf(".");
      return at > 0 && dot > at + 1 && dot < em.length - 1;
    };
    if (!name.trim() || !isEmailOk(email) || message.trim().length < 20 || message.length > 1000) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // --- Turnstile (bypass si pas de secret) ---
    debug("turnstile");
    const secret = process.env.TURNSTILE_SECRET_KEY;
    const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");

    if (secret) {
      if (!token) return res.status(400).json({ error: "Captcha required" });
      const vf = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token /*, remoteip: ip*/ }),
      });
      const data = await vf.json();
      if (!data.success) {
        console.error("Turnstile verify fail:", data);
        return res.status(400).json({ error: "Captcha failed", details: data["error-codes"] || [] });
      }
    } else if (!isLocalDev) {
      // Pour débloquer rapidement la prod même sans secret, COMMENTE la ligne suivante,
      // mais c'est moins sécurisé.
      return res.status(500).json({ error: "Server misconfigured (no Turnstile secret)" });
    }

    // --- Endpoint Formspree ---
    debug("endpoint");
    const endpoint =
      process.env.FORMSPREE_CONTACT_ENDPOINT ||
      process.env.FORMSPREE_ENDPOINT ||
      ""; // ⚠️ idéalement mets FORMSPREE_CONTACT_ENDPOINT sur Vercel

    if (!endpoint) {
      console.error("No form endpoint configured");
      return res.status(500).json({ error: "No form endpoint configured" });
    }

    // --- Envoi au provider ---
    debug("forward");
    const form = new URLSearchParams();
    form.append("name", name);
    form.append("_replyto", email);
    form.append("message", message);
    form.append("_subject", "Nouveau message – pixteryx.fr");

    const fr = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: form });
    if (!fr.ok) {
      const t = await fr.text();
      console.error("Form provider error:", fr.status, t.slice(0, 300));
      return res.status(502).json({ error: "Form provider error", details: t.slice(0, 300) });
    }

    debug("ok");
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Contact API error @", STEP, e);
    res.setHeader("X-Debug-Step", STEP);
    return res.status(500).json({ error: "Server error", step: STEP });
  }
};
