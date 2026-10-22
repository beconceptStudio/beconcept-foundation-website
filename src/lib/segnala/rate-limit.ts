import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

// Upstash (Vercel Marketplace) espone KV_REST_API_*; in alternativa le variabili UPSTASH_REDIS_REST_*.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const upstash =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(LIMIT, "10 m"),
        prefix: "be-foundation:segnala",
      })
    : null;

// Fallback in memoria: vale per singola istanza, utile in sviluppo o se Upstash non è configurato.
const memory = new Map<string, number[]>();

function memoryLimit(key: string) {
  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  memory.set(key, hits);
  return hits.length <= LIMIT;
}

/** true se la richiesta può procedere. In caso di errore di Upstash non blocca l'invio. */
export async function checkRateLimit(ip: string): Promise<boolean> {
  if (!upstash) return memoryLimit(ip);
  try {
    const { success } = await upstash.limit(ip);
    return success;
  } catch (error) {
    console.error("[segnala] rate limit non disponibile", error);
    return memoryLimit(ip);
  }
}
