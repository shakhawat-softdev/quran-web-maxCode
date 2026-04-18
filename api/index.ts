import { Hono } from "hono";
import { handle } from "hono/vercel";

// Import from backend's compiled output after build
// The backend is built to ./backend/dist/
// In production, we reference the source directly which gets compiled by Vercel

// For Vercel, we'll create a simple proxy that imports from backend source
let app: Hono;

try {
  // Try to import from compiled backend (after build)
  const quranRoutes = await import("../backend/dist/routes/quran.routes.js");
  app = new Hono();
  app.route("/v1", quranRoutes.default);
} catch (error) {
  // Fallback: Create a basic app that returns error
  app = new Hono();
  app.get("/*", (c) => {
    return c.json(
      {
        error:
          "Backend not available - ensure backend is built before deployment",
        message: "Run: cd backend && npm run build",
      },
      500,
    );
  });
}

// Root API endpoint
app.get("/", (c) => {
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

export default handle(app);
