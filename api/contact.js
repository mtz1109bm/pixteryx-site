// api/contact.js  (ESM + robustesse + logs de debug)
const safeJSON = (s) => { try { return JSON.parse(s); } catch { return {}; } };
const isLocal = (o) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o || "");
const isEmailOk = (em) => {
  const at = em.indexOf("@"), dot = em.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < em.length - 1;
};

// lecture body Node (si req.body n'est pas déjà parsé)
async function readBody(req) {
  if (req.body) {
    if (typeof req.body === "string") return safeJSON(req.body);
    if (typeof req.body === "object") return req.body;
  }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? safeJSON(raw) : {};
}

export default async function handler(req, res) {
  let STEP = "start";
  const debugStep = (s) => { STEP = s; };

  // --- CORS ---
  debugStep("cors");
  const origin = req.headers.origin || "";
  const isVercelPreview = /\.vercel\.app$/.test(origin);
  const allowList = [
    process.env.ALLOWED_ORIGIN,
    "https://pixteryx.fr",
    "https://www.pixteryx.fr",
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter(Boolean);
  const isAllowed = isVercelPreview || allowList.includes(origin);
  const setCORS = () => {
    res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin : (allowList[0] || "*"));
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("X-Debug-Step", STEP);
  };
  if (req.method === "OPTIONS") { setCORS(); res.status(204).end(); return; }
  if (req.method !== "POST") { setCORS(); res.status(405).json({ error: "Method not allowed" }); return; }
  setCORS();

  try {
    // --- Rate limit (optionnel) : import dynamique ESM, non bloquant si absent ---
    debugStep("rate-limit");
    let limitFn = null;
    try {
      const mod = await import("../_lib/rateLimit.js"); // extension .js requise en ESM
      limitFn = mod.limit || null;
    } catch { /* pas de rate-limit dispo -> on continue */ }

    if (typeof limitFn === "function") {
      const ip = (req.headers["x-forwarded-for"] || "").toString().split(",")[0]?.trim() || req.socket?.remoteAddress || "0.0.0.0";
      const ua = (req.headers["user-agent"] || "").toString().slice(0, 80);
      const rl = await limitFn(`ip:${ip}|ua:${ua}`);
      res.setHeader("X-RateLimit-Limit", String(rl.limit ?? 5));
      res.setHeader("X-RateLimit-Remaining", String(Math.max(0, rl.remaining ?? 0)));
      if (!rl.success) return res.status(429).json({ error: "Trop de requêtes, réessayez plus tard." });
    }

    // --- Parse body ---
    debugStep("parse-body");
    const body = await readBody(req);
    const { name = "", email = "", message = "", token = "", gotcha = "" } = body || {};

    // Honeypot
    debugStep("honeypot");
    if (gotcha && gotcha.trim() !== "") {
      return res.status(200).json({ ok: true });
    }

    // Validations
    debugStep("validate");
    if (!name.trim() || !isEmailOk(email) || message.trim().length < 20 || message.length > 1000) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // --- Turnstile ---
    debugStep("turnstile");
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (secret) {
      if (!token) return res.status(400).json({ error: "Captcha required" });
      const vf = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      });
      const data = await vf.json();
      if (!data.success) {
        console.error("Turnstile verify fail:", data);
        return res.status(400).json({ error: "Captcha failed", details: data["error-codes"] || [] });
      }
    } else if (!isLocal(origin)) {
      // En prod sans secret -> mieux vaut configurer la variable sur Vercel
      return res.status(500).json({ error: "Server misconfigured (no Turnstile secret)" });
    }

    // --- Endpoint Formspree ---
    debugStep("endpoint");
    const endpoint =
      process.env.FORMSPREE_CONTACT_ENDPOINT ||
      process.env.FORMSPREE_ENDPOINT ||
      ""; // ⚠️ mets FORMSPREE_CONTACT_ENDPOINT sur Vercel

    if (!endpoint) {
      console.error("No form endpoint configured");
      return res.status(500).json({ error: "No form endpoint configured" });
    }

    // --- Envoi ---
    debugStep("forward");
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

    debugStep("ok");
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Contact API error @", STEP, e);
    res.setHeader("X-Debug-Step", STEP);
    return res.status(500).json({ error: "Server error", step: STEP });
  }
}
