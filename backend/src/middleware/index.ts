import type { Context, Next } from "hono";

export async function corsMiddleware(
  c: Context,
  next: Next,
): Promise<Response | void> {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  c.header("Access-Control-Max-Age", "86400");

  if (c.req.method === "OPTIONS") {
    // ✅ Return a proper Response — not just set status and return void
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  await next();
}

export async function loggingMiddleware(c: Context, next: Next): Promise<void> {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  await next();
  const duration = Date.now() - start;
  const status = c.res.status;
  console.log(
    `[${new Date().toISOString()}] ${method} ${path} - ${status} (${duration}ms)`,
  );
}

export async function errorMiddleware(c: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);
    c.status(500);
    await c.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        status: 500,
      },
    });
  }
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

class RateLimiter {
  private requests = new Map<string, number[]>();

  constructor(private config: RateLimitConfig) {}

  async middleware(c: Context, next: Next): Promise<void> {
    // ✅ Safe header reading for both Vercel (Node IncomingMessage) and local (Web Headers)
    const rawHeaders = c.req.raw.headers;
    const getHeader = (key: string): string | undefined => {
      const headersLike = rawHeaders as unknown as {
        get?: (k: string) => string | null;
      };

      if (typeof headersLike.get === "function") {
        return headersLike.get(key) ?? undefined;
      }

      const recordHeaders = rawHeaders as unknown as Record<
        string,
        string | string[] | undefined
      >;
      const value = recordHeaders[key.toLowerCase()];
      return Array.isArray(value) ? value[0] : value;
    };

    const ip =
      getHeader("x-forwarded-for") || getHeader("x-real-ip") || "unknown";
    const now = Date.now();

    let requestTimes = this.requests.get(ip) || [];
    requestTimes = requestTimes.filter(
      (time) => now - time < this.config.windowMs,
    );

    if (requestTimes.length >= this.config.maxRequests) {
      c.status(429);
      await c.json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: `Rate limit exceeded. Max ${this.config.maxRequests} requests per ${this.config.windowMs / 1000} seconds`,
          status: 429,
        },
      });
      return;
    }

    requestTimes.push(now);
    this.requests.set(ip, requestTimes);

    if (Math.random() < 0.01) this.cleanup();

    c.header("X-RateLimit-Limit", this.config.maxRequests.toString());
    c.header(
      "X-RateLimit-Remaining",
      (this.config.maxRequests - requestTimes.length).toString(),
    );

    await next();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [ip, times] of this.requests.entries()) {
      const remaining = times.filter(
        (time) => now - time < this.config.windowMs,
      );
      if (remaining.length === 0) this.requests.delete(ip);
      else this.requests.set(ip, remaining);
    }
  }
}

export const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});