import { Context, Next } from "hono";

export interface CorsOptions {
  origin?: string | string[] | RegExp;
  allowMethods?: string[];
  allowHeaders?: string[];
  exposeHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
}

export function cors(options: CorsOptions = {}) {
  const {
    origin = "*",
    allowMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders = ["Content-Type", "Authorization"],
    exposeHeaders = ["Content-Length", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
    maxAge = 86400,
    credentials = false,
  } = options;

  return async (c: Context, next: Next): Promise<Response> => {
    const requestOrigin = c.req.header("origin") || "*";

    // Check if origin is allowed
    let isOriginAllowed = false;
    if (origin === "*") {
      isOriginAllowed = true;
    } else if (typeof origin === "string") {
      isOriginAllowed = origin === requestOrigin;
    } else if (Array.isArray(origin)) {
      isOriginAllowed = origin.includes(requestOrigin);
    } else if (origin instanceof RegExp) {
      isOriginAllowed = origin.test(requestOrigin);
    }

    // Handle preflight
    if (c.req.method === "OPTIONS") {
      c.header("Access-Control-Allow-Origin", isOriginAllowed ? requestOrigin : "");
      c.header("Access-Control-Allow-Methods", allowMethods.join(", "));
      c.header("Access-Control-Allow-Headers", allowHeaders.join(", "));
      c.header("Access-Control-Expose-Headers", exposeHeaders.join(", "));
      c.header("Access-Control-Max-Age", maxAge.toString());

      if (credentials) {
        c.header("Access-Control-Allow-Credentials", "true");
      }

      return new Response("", { status: 204 });
    }

    // Handle actual request
    if (isOriginAllowed) {
      c.header("Access-Control-Allow-Origin", requestOrigin);
      c.header("Access-Control-Expose-Headers", exposeHeaders.join(", "));

      if (credentials) {
        c.header("Access-Control-Allow-Credentials", "true");
      }
    }

    await next();
    return c.res;
  };
}
