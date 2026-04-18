import { Hono } from "hono";
import { handle } from "hono/vercel";
import { setupRoutes } from "../src/routes/index.js";
import {
  corsMiddleware,
  loggingMiddleware,
  errorMiddleware,
  rateLimiter,
} from "../src/middleware/index.js";

export const config = {
  runtime: "nodejs20.x",
};

const app = new Hono().basePath("/api");

// Keep middleware behavior aligned with local dev server.
app.use(errorMiddleware);
app.use(loggingMiddleware);
app.use(corsMiddleware);
app.use((c, next) => rateLimiter.middleware(c, next));

// Mount all existing routes from src.
const stripApiPrefix = (path: string): string =>
  path.startsWith("/api/") ? path.slice(4) : path === "/api" ? "/" : path;

const routeAdapter = {
  get: (path: string, ...handlers: any[]) =>
    (app as any).get(stripApiPrefix(path), ...handlers),
  all: (path: string, ...handlers: any[]) =>
    (app as any).all(stripApiPrefix(path), ...handlers),
} as any;

setupRoutes(routeAdapter);

export default handle(app);
