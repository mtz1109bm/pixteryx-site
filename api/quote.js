// api/quote.js  (ESM + robustesse + logs de debug)
const safeJSON = (s) => { try { return JSON.parse(s); } catch { return {}; } };
const isLocal = (o) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o || "");
const isEmailOk = (em) => { const at = em.indexOf("@"), dot = em.lastIndexOf("."); return at > 0 && dot > at + 1 && dot < em.length - 1; };

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
  let STEP = "start"; const dbg = (s) => { STEP = s; };

  // --- CORS ---
  dbg("cors");
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
    // --- Rate limit (optionnel) ---
    dbg("rate-limit");
    let limitFn = null;
    try {
      const mod = await import("../_lib/rateLimit.js"); // ok si absent
      limitFn = mod.limit || null;
    } catch {}
    if (typeof limitFn === "function") {
      const ip = (req.headers["x-forwarded-for"] || "").toString().split(",")[0]?.trim() || req.socket?.remoteAddress || "0.0.0.0";
      const ua = (req.headers["user-agent"] || "").toString().slice(0,80);
      const rl = await limitFn(`ip:${ip}|ua:${ua}`);
      res.setHeader("X-RateLimit-Limit", String(rl.limit ?? 5));
      res.setHeader("X-RateLimit-Remaining", String(Math.max(0, rl.remaining ?? 0)));
      if (!rl.success) return res.status(429).json({ error:"Trop de requêtes, réessayez plus tard." });
    }

    // --- Parse body ---
    dbg("parse-body");
    const body = await readBody(req);
    const {
      name = "", email = "", notes = "", token = "",
      service, complexity, scope, deadline, features,
      estimate = {},
    } = body || {};

    // Validations min
    dbg("validate");
    if (!name.trim() || !isEmailOk(email)) return res.status(400).json({ error:"Invalid input (identity)" });

    const SERVICES = ["ia-ml","vision","data-analytics","dev-web-mobile","signal","conseil-audit"];
    const COMPLEX = ["low","med","high"];
    const SCOPES = ["mvp","std","xl"];
    const DEADLINES = ["flex","normal","rush"];

    if (!SERVICES.includes(service) || !COMPLEX.includes(complexity) || !SCOPES.includes(scope) || !DEADLINES.includes(deadline)) {
      return res.status(400).json({ error:"Invalid input (selectors)" });
    }
    const f = Number(features);
    if (!Number.isFinite(f) || f < 3 || f > 12) return res.status(400).json({ error:"Invalid input (features)" });

    // --- Turnstile ---
    dbg("turnstile");
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (secret) {
      if (!token) return res.status(400).json({ error:"Captcha required" });
      const vf = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method:"POST",
        headers:{ "content-type":"application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      });
      const data = await vf.json();
      if (!data.success) {
        console.error("Turnstile verify fail:", data);
        return res.status(400).json({ error:"Captcha failed", details: data["error-codes"] || [] });
      }
    } else if (!isLocal(origin)) {
      return res.status(500).json({ error:"Server misconfigured (no Turnstile secret)" });
    }

    // --- Endpoint Formspree ---
    dbg("endpoint");
    const endpoint =
      process.env.FORMSPREE_QUOTE_ENDPOINT ||
      process.env.FORMSPREE_ENDPOINT ||
      "";
    if (!endpoint) {
      console.error("No form endpoint configured (quote)");
      return res.status(500).json({ error:"No form endpoint configured" });
    }

    // --- Build message ---
    const lines = [
      "[DEMANDE DEVIS RAPIDE]",
      `Nom: ${name}`,
      `Email: ${email}`,
      ``,
      `Service: ${service}`,
      `Complexité: ${complexity}`,
      `Portée: ${scope}`,
      `Échéance: ${deadline}`,
      `Fonctionnalités: ${f}`,
      `Estimation: ${estimate?.daysMin ?? "?"}-${estimate?.daysMax ?? "?"} j / ~${estimate?.priceMin ?? "?"}-${estimate?.priceMax ?? "?"} €`,
      ``,
      `Notes: ${notes || "-"}`,
    ].join("\n");

    // --- Envoi ---
    dbg("forward");
    const form = new URLSearchParams();
    form.append("name", name);
    form.append("_replyto", email);
    form.append("message", lines);
    form.append("_subject", "Devis rapide – pixteryx.fr");

    const fr = await fetch(endpoint, { method:"POST", headers:{ Accept:"application/json" }, body: form });
    if (!fr.ok) {
      const t = await fr.text();
      console.error("Form provider error (quote):", fr.status, t.slice(0,300));
      return res.status(502).json({ error:"Form provider error", details: t.slice(0,300) });
    }

    dbg("ok");
    return res.status(200).json({ ok:true });
  } catch (e) {
    console.error("Quote API error @", STEP, e);
    res.setHeader("X-Debug-Step", STEP);
    return res.status(500).json({ error:"Server error", step: STEP });
  }
}
