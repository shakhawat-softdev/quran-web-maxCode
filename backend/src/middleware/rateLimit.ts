import { Context, Next } from "hono";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export function createRateLimiter(
  windowMs: number = 60000, // 1 minute
  maxRequests: number = 100
) {
  const store: RateLimitStore = {};

  return async (c: Context, next: Next): Promise<Response> => {
    const ip = c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown";
    const key = `${ip}:${c.req.path}`;
    const now = Date.now();

    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    const record = store[key];

    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    record.count++;

    // Add rate limit headers
    c.header("X-RateLimit-Limit", maxRequests.toString());
    c.header("X-RateLimit-Remaining", Math.max(0, maxRequests - record.count).toString());
    c.header("X-RateLimit-Reset", record.resetTime.toString());

    if (record.count > maxRequests) {
      return c.json(
        {
          success: false,
          message: "Too many requests",
          error: `Rate limit exceeded. Maximum ${maxRequests} requests per minute.`,
        } as Record<string, unknown>,
        429 as unknown as undefined
      );
    }

    await next();
    return c.res;
  };
}

// Cleanup old entries periodically
export function startRateLimitCleanup() {
  setInterval(() => {
    const now = Date.now();
    // Cleanup logic could be added here if needed
  }, 300000); // Every 5 minutes
}
