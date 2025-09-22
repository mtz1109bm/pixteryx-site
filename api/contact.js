export default async function handler(req, res) {
  // --- CORS ---
  const origin = req.headers.origin || "";
  const allowed = [
    process.env.ALLOWED_ORIGIN,
    "https://pixteryx.fr",
    "https://www.pixteryx.fr",
    "http://localhost:5173"
  ].filter(Boolean);
  const okOrigin = allowed.some((o) => o === "*" || o === origin);

  const setCORS = () => {
    res.setHeader("Access-Control-Allow-Origin", okOrigin ? origin : allowed[0] || "*");
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  };

  if (req.method === "OPTIONS") {
    setCORS();
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    setCORS();
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  setCORS();

  try {
    // Parse JSON (Vercel Node parse d’habitude, sinon fallback)
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { name = "", email = "", message = "", token = "", gotcha = "" } = body;

    // Honeypot => on prétend que c'est ok, mais on ignore
    if (gotcha && gotcha.trim() !== "") {
      return res.status(200).json({ ok: true }); // bot piégé
    }

    // Validations simples
    const isEmailOk = (em) => {
      const at = em.indexOf("@");
      const dot = em.lastIndexOf(".");
      return at > 0 && dot > at + 1 && dot < em.length - 1;
    };
    if (!name.trim() || !isEmailOk(email) || message.trim().length < 20 || message.length > 1000) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Verify Turnstile
    const ip =
      (req.headers["x-forwarded-for"] || "").toString().split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: "Server misconfigured (no Turnstile secret)" });
    }

    const verifResp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    });
    const verifData = await verifResp.json();

    if (!verifData.success) {
      return res.status(400).json({ error: "Captcha failed", details: verifData["error-codes"] || [] });
    }

    // Forward to Formspree
    const endpoint = process.env.FORMSPREE_ENDPOINT;
    if (!endpoint) {
      return res.status(500).json({ error: "Server misconfigured (no Formspree endpoint)" });
    }

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
      const txt = await fr.text();
      return res.status(502).json({ error: "Form provider error", details: txt.slice(0, 300) });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}
