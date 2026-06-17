// lib/rate-limit.ts — In-memory sliding-window rate limiter
// For production with Upstash Redis, replace the Map with Redis INCR + EXPIRE.
// This in-memory version works correctly on a single server instance (Hostinger VPS).

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Shared in-memory store (persists across requests in the same Node process)
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

/**
 * Check and increment rate limit for a given key.
 * @param key — unique identifier (e.g. "auth:192.168.1.1")
 * @param limit — max requests per window
 * @param windowMs — window duration in ms (default 60_000 = 1 minute)
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs, limit };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt, limit };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt, limit };
}

/**
 * Rate limit presets per route type.
 */
export const RATE_LIMITS = {
  auth: { limit: 10, windowMs: 15 * 60 * 1000 },        // 10 per 15 min — login/register
  api: { limit: 100, windowMs: 60 * 1000 },              // 100 per minute — general API
  search: { limit: 60, windowMs: 60 * 1000 },            // 60 per minute — search
  upload: { limit: 20, windowMs: 60 * 60 * 1000 },       // 20 per hour — file uploads
  reviews: { limit: 5, windowMs: 60 * 60 * 1000 },       // 5 per hour — review submission
} as const;
