

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { setupRoutes } from "../src/routes/index.js";
import {
  corsMiddleware,
  loggingMiddleware,
  errorMiddleware,
  rateLimiter,
} from "../src/middleware/index.js";

const app = new Hono();

app.use("*", errorMiddleware);
app.use("*", loggingMiddleware);
app.use("*", corsMiddleware);
app.use("*", (c, next) => rateLimiter.middleware(c, next));

setupRoutes(app);

export default handle(app);
