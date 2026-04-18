import { Context } from "hono";
import { QuranService } from "../services/quranService.js";
import { successResponse, notFoundResponse, errorResponse } from "../utils/response.js";
import { getPaginationParams, paginate } from "../utils/pagination.js";

export class SurahController {
  /**
   * Get all surahs
   */
  static async getAllSurahs(c: Context) {
    try {
      const surahs = QuranService.getAllSurahs();

      // Return minimal info without ayahs for list view
      const surahList = surahs.map((s) => ({
        id: s.id,
        number: s.number,
        name_arabic: s.name_arabic,
        name_english: s.name_english,
        name_transliteration: s.name_transliteration,
        revelation_type: s.revelation_type,
        total_ayahs: s.total_ayahs,
        description: s.description,
      }));

      const metadata = {
        total: surahList.length,
        api_version: "v1",
      };

      return successResponse(c, surahList, "All surahs retrieved successfully", 200, metadata);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to retrieve surahs";
      return errorResponse(c, message, 500);
    }
  }

  /**
   * Get specific surah with all ayahs
   */
  static async getSurahById(c: Context) {
    try {
      const idParam = c.req.param("id");
      const id = parseInt(idParam || "0", 10);

      if (isNaN(id) || id < 1 || id > 114) {
        return errorResponse(c, "Invalid surah ID. Must be between 1 and 114", 400);
      }

      const surah = QuranService.getSurahById(id);

      if (!surah) {
        return notFoundResponse(c, `Surah with ID ${id} not found`);
      }

      const metadata = {
        ayah_count: surah.ayahs.length,
        revelation_type: surah.revelation_type,
      };

      return successResponse(
        c,
        surah,
        `Surah ${surah.name_english} retrieved successfully`,
        200,
        metadata
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to retrieve surah";
      return errorResponse(c, message, 500);
    }
  }

  /**
   * Get specific ayah
   */
  static async getAyah(c: Context) {
    try {
      const surahIdParam = c.req.param("surahId");
      const ayahNumberParam = c.req.param("ayahNumber");
      const surahId = parseInt(surahIdParam || "0", 10);
      const ayahNumber = parseInt(ayahNumberParam || "0", 10);

      if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        return errorResponse(c, "Invalid surah ID", 400);
      }

      if (isNaN(ayahNumber) || ayahNumber < 1) {
        return errorResponse(c, "Invalid ayah number", 400);
      }

      const ayah = QuranService.getAyah(surahId, ayahNumber);

      if (!ayah) {
        return notFoundResponse(c, `Ayah ${ayahNumber} not found in Surah ${surahId}`);
      }

      const surah = QuranService.getSurahById(surahId)!;

      return successResponse(
        c,
        {
          ayah,
          surah: {
            id: surah.id,
            name: surah.name_english,
            number: surah.number,
          },
        },
        "Ayah retrieved successfully"
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to retrieve ayah";
      return errorResponse(c, message, 500);
    }
  }

  /**
   * Get statistics
   */
  static async getStatistics(c: Context) {
    try {
      const stats = QuranService.getStatistics();

      return successResponse(c, stats, "Statistics retrieved successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to retrieve statistics";
      return errorResponse(c, message, 500);
    }
  }
}

export class SearchController {
  /**
   * Search ayahs
   */
  static async searchAyahs(c: Context) {
    try {
      const query = c.req.query("q") || "";
      const paginationParams = getPaginationParams({
        page: c.req.query("page"),
        limit: c.req.query("limit"),
      });

      if (!query || query.trim().length === 0) {
        return errorResponse(c, "Search query is required", 400);
      }

      if (query.length < 2) {
        return errorResponse(c, "Search query must be at least 2 characters", 400);
      }

      const results = QuranService.searchAyahs(query);
      const paginatedResults = paginate(results, paginationParams.page, paginationParams.limit);

      const metadata = {
        query,
        api_version: "v1",
      };

      return successResponse(
        c,
        paginatedResults,
        `Found ${results.length} results for "${query}"`,
        200,
        metadata
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Search failed";
      return errorResponse(c, message, 500);
    }
  }

  /**
   * Advanced search with filters
   */
  static async advancedSearch(c: Context) {
    try {
      const query = c.req.query("q") || "";
      const surahId = c.req.query("surah_id");
      const paginationParams = getPaginationParams({
        page: c.req.query("page"),
        limit: c.req.query("limit"),
      });

      if (!query || query.trim().length === 0) {
        return errorResponse(c, "Search query is required", 400);
      }

      let results = QuranService.searchAyahs(query);

      // Filter by surah if provided
      if (surahId) {
        const surahIdNum = parseInt(surahId, 10);
        if (!isNaN(surahIdNum)) {
          results = results.filter((r) => r.ayah.surah === surahIdNum);
        }
      }

      const paginatedResults = paginate(results, paginationParams.page, paginationParams.limit);

      return successResponse(
        c,
        paginatedResults,
        `Found ${results.length} results`,
        200,
        { query, surah_filter: surahId || "none" }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Advanced search failed";
      return errorResponse(c, message, 500);
    }
  }
}
