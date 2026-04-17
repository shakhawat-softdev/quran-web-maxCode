// Main Application Entry Point
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { setupRoutes } from "./routes/index.js";
import {
  corsMiddleware,
  loggingMiddleware,
  errorMiddleware,
  rateLimiter,
} from "./middleware/index.js";

// Create Hono app
const app = new Hono();

// Register global middleware (order matters)
app.use(errorMiddleware);
app.use(loggingMiddleware);
app.use(corsMiddleware);
app.use((c, next) => rateLimiter.middleware(c, next));

// Setup all routes
setupRoutes(app);

// Server configuration
const PORT = parseInt(process.env.PORT || "3000");
const HOST = process.env.HOST || "0.0.0.0";

// Start server
console.log(`🚀 Quran API Server starting...`);
console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`🔗 Listening on http://${HOST}:${PORT}`);
console.log(`� Swagger UI Documentation: http://${HOST}:${PORT}/api-docs`);
console.log(`📚 API Info: http://${HOST}:${PORT}/api/v1/info`);
console.log(`💾 Cache TTL: ${process.env.CACHE_TTL || "3600000"}ms`);
console.log(
  `🛡️  Rate Limit: ${process.env.RATE_LIMIT_MAX || "100"} requests per ${process.env.RATE_LIMIT_WINDOW || "900000"}ms`,
);

serve({
  fetch: app.fetch,
  port: PORT,
  hostname: HOST,
});
