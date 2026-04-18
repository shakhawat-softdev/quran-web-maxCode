import { Context, Next } from "hono";
import { serverErrorResponse } from "../utils/response.js";

export async function errorHandler(c: Context, next: Next): Promise<Response> {
  try {
    await next();
    return c.res;
  } catch (error) {
    console.error("Error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";

    return serverErrorResponse(c, message);
  }
}

export async function logger(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  console.log(`${method} ${path} - ${status} (${duration}ms)`);
}
