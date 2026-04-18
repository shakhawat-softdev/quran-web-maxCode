import { Hono } from "hono";
import { SurahController, SearchController } from "../controllers/index.js";

export const surahRoutes = new Hono();

/**
 * GET /api/v1/surahs
 * Get all surahs
 */
surahRoutes.get("/surahs", (c) => SurahController.getAllSurahs(c));

/**
 * GET /api/v1/surahs/:id
 * Get specific surah with all ayahs
 */
surahRoutes.get("/surahs/:id", (c) => SurahController.getSurahById(c));

/**
 * GET /api/v1/surahs/:surahId/ayahs/:ayahNumber
 * Get specific ayah
 */
surahRoutes.get("/surahs/:surahId/ayahs/:ayahNumber", (c) => SurahController.getAyah(c));

/**
 * GET /api/v1/surahs/stats
 * Get Quran statistics
 */
surahRoutes.get("/surahs/stats/overview", (c) => SurahController.getStatistics(c));

export const searchRoutes = new Hono();

/**
 * GET /api/v1/search
 * Search ayahs by translation text
 */
searchRoutes.get("/", (c) => SearchController.searchAyahs(c));

/**
 * GET /api/v1/search/advanced
 * Advanced search with filters
 */
searchRoutes.get("/advanced", (c) => SearchController.advancedSearch(c));
