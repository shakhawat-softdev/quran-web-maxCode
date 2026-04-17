// API Controllers
import type { Context } from "hono";
import { quranService } from "../services/quran.js";
import type { ApiResponse, ApiError, SurahListResponse } from "../types/index.ts";

export class QuranController {
  // Get all surahs
  static async getAllSurahs(c: Context): Promise<Response> {
    try {
      const surahs = quranService.getAllSurahs();
      
      const response: ApiResponse<SurahListResponse> = {
        success: true,
        data: {
          surahs
        },
        metadata: {
          total: surahs.length
        }
      };

      return c.json(response);
    } catch (error) {
      const errorResponse: ApiError = {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch surahs",
          status: 500
        }
      };
      return c.json(errorResponse, 500);
    }
  }

  // Get surah by ID
  static async getSurahById(c: Context): Promise<Response> {
    try {
      const idParam = c.req.param("id");
      
      // Validate parameter exists
      if (!idParam) {
        const errorResponse: ApiError = {
          success: false,
          error: {
            code: "MISSING_SURAH_ID",
            message: "Surah ID parameter is required",
            status: 400
          }
        };
        return c.json(errorResponse, 400);
      }

      const id = parseInt(idParam);

      // Validate ID
      if (isNaN(id) || !quranService.isValidSurahId(id)) {
        const errorResponse: ApiError = {
          success: false,
          error: {
            code: "INVALID_SURAH_ID",
            message: `Invalid surah ID. Must be between 1 and 114. Received: ${idParam}`,
            status: 400
          }
        };
        return c.json(errorResponse, 400);
      }

      const surah = quranService.getSurahDetail(id);

      if (!surah) {
        const errorResponse: ApiError = {
          success: false,
          error: {
            code: "SURAH_NOT_FOUND",
            message: `Surah with ID ${id} not found`,
            status: 404
          }
        };
        return c.json(errorResponse, 404);
      }

      const response: ApiResponse<typeof surah> = {
        success: true,
        data: surah,
        metadata: {
          total: surah.ayahs.length
        }
      };

      return c.json(response);
    } catch (error) {
      const errorResponse: ApiError = {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch surah details",
          status: 500
        }
      };
      return c.json(errorResponse, 500);
    }
  }

  // Search ayahs
  static async searchAyahs(c: Context): Promise<Response> {
    try {
      const query = c.req.query("q");
      const page = parseInt(c.req.query("page") || "1");
      const limit = parseInt(c.req.query("limit") || "20");

      // Validate query
      if (!query || query.trim().length === 0) {
        const errorResponse: ApiError = {
          success: false,
          error: {
            code: "MISSING_QUERY",
            message: "Search query parameter 'q' is required",
            status: 400
          }
        };
        return c.json(errorResponse, 400);
      }

      // Validate pagination parameters
      if (isNaN(page) || page < 1) {
        const errorResponse: ApiError = {
          success: false,
          error: {
            code: "INVALID_PAGE",
            message: "Page must be a positive integer",
            status: 400
          }
        };
        return c.json(errorResponse, 400);
      }

      if (isNaN(limit) || limit < 1 || limit > 100) {
        const errorResponse: ApiError = {
          success: false,
          error: {
            code: "INVALID_LIMIT",
            message: "Limit must be between 1 and 100",
            status: 400
          }
        };
        return c.json(errorResponse, 400);
      }

      const searchResult = quranService.searchAyahs(query, page, limit);

      const response: ApiResponse<typeof searchResult.results> = {
        success: true,
        data: searchResult.results,
        metadata: {
          total: searchResult.total,
          page: searchResult.page,
          limit: searchResult.limit,
          hasMore: searchResult.page < searchResult.totalPages
        }
      };

      return c.json(response);
    } catch (error) {
      const errorResponse: ApiError = {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to search ayahs",
          status: 500
        }
      };
      return c.json(errorResponse, 500);
    }
  }
}
