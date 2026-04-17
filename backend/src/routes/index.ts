// API Routes
import type { Hono } from "hono";
import { QuranController } from "../controllers/quran.js";

export function setupRoutes(app: Hono): void {
  // API v1 routes - using /api/v1 prefix

  // Get all surahs
  app.get("/api/v1/surahs", (c) => QuranController.getAllSurahs(c));

  // Get surah by ID with all ayahs
  app.get("/api/v1/surah/:id", (c) => QuranController.getSurahById(c));

  // Search ayahs
  app.get("/api/v1/search", (c) => QuranController.searchAyahs(c));

  // Health check endpoint
  app.get("/api/v1/health", (c) =>
    c.json({
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      }
    })
  );

  // API info endpoint
  app.get("/api/v1/info", (c) =>
    c.json({
      success: true,
      data: {
        name: "Quran API",
        version: "1.0.0",
        description: "Scalable Quran API with search and caching",
        documentation: "See /api/v1/docs for full API documentation",
        endpoints: {
          surahs: "/api/v1/surahs",
          surah: "/api/v1/surah/:id",
          search: "/api/v1/search?q=query&page=1&limit=20",
          health: "/api/v1/health"
        },
        features: [
          "In-memory caching with TTL",
          "Full-text search with pagination",
          "Rate limiting (100 requests per 15 minutes)",
          "CORS enabled",
          "Comprehensive error handling"
        ]
      }
    })
  );

  // API Documentation
  app.get("/api/v1/docs", (c) =>
    c.json({
      success: true,
      data: {
        title: "Quran API Documentation",
        baseUrl: "/api/v1",
        endpoints: [
          {
            path: "/surahs",
            method: "GET",
            description: "Get all 114 surahs",
            parameters: [],
            example: "GET /api/v1/surahs"
          },
          {
            path: "/surah/:id",
            method: "GET",
            description: "Get specific surah with all ayahs",
            parameters: [{ name: "id", type: "number", required: true }],
            example: "GET /api/v1/surah/1"
          },
          {
            path: "/search",
            method: "GET",
            description: "Search ayahs by translation text",
            parameters: [
              { name: "q", type: "string", required: true, description: "Search query" },
              { name: "page", type: "number", required: false, default: 1 },
              { name: "limit", type: "number", required: false, default: 20, max: 100 }
            ],
            example: "GET /api/v1/search?q=mercy&page=1&limit=20"
          },
          {
            path: "/health",
            method: "GET",
            description: "Health check endpoint",
            example: "GET /api/v1/health"
          }
        ]
      }
    })
  );

  // Root path redirects to info
  app.get("/", (c) => c.json({
    message: "Quran API - See /api/v1/info for documentation",
    doc: "Use /api/v1/surahs, /api/v1/surah/:id, or /api/v1/search?q=..."
  }));

  // 404 handler
  app.all("*", (c) =>
    c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Endpoint not found. See /api/v1/info for available endpoints",
          status: 404,
          requested_path: c.req.path,
          available_endpoints: {
            surahs: "/api/v1/surahs",
            surah: "/api/v1/surah/:id",
            search: "/api/v1/search",
            info: "/api/v1/info",
            docs: "/api/v1/docs",
            health: "/api/v1/health"
          }
        }
      },
      404
    )
  );
}
