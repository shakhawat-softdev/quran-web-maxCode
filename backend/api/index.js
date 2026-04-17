// Vercel Serverless Handler for Hono
import { Hono } from "hono";
import { setupRoutes } from "../dist/routes/index.js";
import {
  corsMiddleware,
  loggingMiddleware,
  errorMiddleware,
  rateLimiter,
} from "../dist/middleware/index.js";

// Create Hono app
const app = new Hono();

// Register global middleware (order matters)
app.use(errorMiddleware);
app.use(loggingMiddleware);
app.use(corsMiddleware);
app.use((c, next) => rateLimiter.middleware(c, next));

// Setup all routes
setupRoutes(app);

// Export Vercel handler
export default async (req, res) => {
  try {
    // Convert Vercel request to fetch API Request
    const url = new URL(
      req.url || "/",
      `http://${req.headers.host || "localhost"}`,
    );

    const request = new Request(url, {
      method: req.method,
      headers: new Headers(
        Object.entries(req.headers).reduce((acc, [key, value]) => {
          if (typeof value === "string") {
            acc[key] = value;
          }
          return acc;
        }, {}),
      ),
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    // Handle with Hono
    const response = await app.fetch(request);

    // Set response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send response
    res.status(response.status);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
