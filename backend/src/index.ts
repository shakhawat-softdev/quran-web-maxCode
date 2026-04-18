import { Hono } from "hono";
import { surahRoutes, searchRoutes } from "./routes/v1.js";
import { cors } from "./middleware/cors.js";
import { createRateLimiter } from "./middleware/rateLimit.js";
import { errorHandler, logger } from "./middleware/index.js";
import { successResponse, errorResponse } from "./utils/response.js";

const app = new Hono();

// Middleware
app.use(logger);
app.use(errorHandler);

// CORS Configuration
app.use(
  "*",
  cors({
    origin: ["*"], // Allow all origins. Change to specific domains for production
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: [
      "Content-Length",
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ],
    credentials: false,
  })
);

// Rate limiting - 100 requests per minute per IP
app.use("/api/*", createRateLimiter(60000, 100));

// Health check
app.get("/health", (c) => {
  return successResponse(c, { status: "ok" }, "Server is running");
});

// API Info
app.get("/api", (c) => {
  return successResponse(
    c,
    {
      name: "Quran API",
      version: "1.0.0",
      description: "A scalable Quran API built with Hono",
      endpoints: {
        v1: "/api/v1",
      },
    },
    "API information"
  );
});

// API v1 routes
app.route("/api/v1", surahRoutes);
app.route("/api/v1/search", searchRoutes);

// 404 handler
app.notFound((c) => {
  return errorResponse(c, `Endpoint ${c.req.path} not found`, 404);
});

export default app;
