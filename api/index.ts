import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

// Try to import backend routes if compiled
let hasBackend = false;

try {
  const { default: quranRoutes } =
    await import("../backend/dist/routes/quran.routes.js");
  app.route("/v1", quranRoutes);
  hasBackend = true;
} catch (error) {
  console.error("Backend routes not available:", error);
}

// Root API status endpoint
app.get("/", (c) => {
  if (!hasBackend) {
    return c.json(
      {
        error: "Backend not loaded",
        message: "Backend routes failed to load - check deployment logs",
      },
      500,
    );
  }

  return c.json({
    success: true,
    message: "Quran API v1.0.0 is running",
    endpoints: {
      surahs: "/api/v1/surahs",
      surah: "/api/v1/surah/:id",
      search: "/api/v1/search?q=keyword",
      status: "/api/v1/status",
    },
  });
});

// For any unmatched API routes
app.notFound((c) => {
  return c.json(
    {
      error: "Endpoint not found",
      available: "/api/v1/*",
    },
    404,
  );
});

export default handle(app);
