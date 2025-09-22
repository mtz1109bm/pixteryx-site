// api/_lib/rateLimit.js (CommonJS pour compat server Vercel)
const { Ratelimit } = require("@upstash/ratelimit");
const { Redis } = require("@upstash/redis");

// Instancie Redis uniquement si les variables sont présentes
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// 5 requêtes / 10 minutes (sliding window)
const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
      prefix: "rl:contact",
    })
  : null;

// key: string (ex: "ip:1.2.3.4|ua:Mozilla/5.0")
async function limit(key) {
  if (!limiter) {
    // Upstash non configuré -> on laisse passer
    return { success: true, remaining: 999, limit: 999, reset: Date.now() + 60_000 };
  }
  return limiter.limit(key);
}

module.exports = { limit };
