// Quran Service - Business Logic
import { getAllSurahs, getSurahById, getAyahsBySurah, surahMetadata, searchIndex } from "../data/quran.js";
import type { Surah, Ayah } from "../data/quran.js";
import type { SurahSummary, SearchResult, SurahDetailResponse, AyahData } from "../types/index.js";
import { cacheService } from "./cache.js";

class QuranService {
  private readonly CACHE_TTL = 3600000; // 1 hour
  private readonly CACHE_KEY_SURAHS = "all_surahs";

  // Get all surahs with caching
  getAllSurahs(): SurahSummary[] {
    const cacheKey = this.CACHE_KEY_SURAHS;

    // Check cache first
    const cached = cacheService.get<SurahSummary[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build response from data
    const surahs = getAllSurahs().map((surah) => ({
      id: surah.id,
      name_arabic: surah.name_arabic,
      name_english: surah.name_english,
      name_transliteration: surah.name_transliteration,
      total_ayahs: surah.total_ayahs,
    }));

    // Cache the result
    cacheService.set(cacheKey, surahs, this.CACHE_TTL);
    return surahs;
  }

  // Get surah by ID with all ayahs
  getSurahDetail(surahId: number): SurahDetailResponse | null {
    const surah = getSurahById(surahId);
    if (!surah) {
      return null;
    }

    const ayahs = getAyahsBySurah(surahId);

    return {
      id: surah.id,
      name_arabic: surah.name_arabic,
      name_english: surah.name_english,
      name_transliteration: surah.name_transliteration,
      total_ayahs: surah.total_ayahs,
      revelation_place: surah.revelation_place,
      revelation_order: surah.revelation_order,
      ayahs: ayahs.map((ayah) => ({
        ayah_number: ayah.ayah_number,
        arabic_text: ayah.arabic_text,
        translation: ayah.translation,
        surah_id: surahId,
        surah_name: surah.name_english,
      })),
    };
  }

  // Search ayahs by translation text
  // searchAyahs(query: string, page: number = 1, limit: number = 20): {
  //   results: SearchResult[];
  //   total: number;
  //   page: number;
  //   limit: number;
  //   totalPages: number;
  // } {
  //   const normalizedQuery = query.toLowerCase().trim();
  //   const results: SearchResult[] = [];

  //   // Search through all surahs and their ayahs
  //   for (const surah of surahMetadata) {
  //     const ayahs = getAyahsBySurah(surah.id);

  //     for (const ayah of ayahs) {
  //       // Search in both translation and transliteration
  //       if (
  //         ayah.translation.toLowerCase().includes(normalizedQuery) ||
  //         (ayah.transliteration && ayah.transliteration.toLowerCase().includes(normalizedQuery))
  //       ) {
  //         results.push({
  //           ayah_number: ayah.ayah_number,
  //           arabic_text: ayah.arabic_text,
  //           translation: ayah.translation,
  //           surah_id: surah.id,
  //           surah_name: surah.name_english
  //         });
  //       }
  //     }
  //   }

  //   // Calculate pagination
  //   const total = results.length;
  //   const totalPages = Math.ceil(total / limit);
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = startIndex + limit;
  //   const paginatedResults = results.slice(startIndex, endIndex);

  //   return {
  //     results: paginatedResults,
  //     total,
  //     page,
  //     limit,
  //     totalPages
  //   };
  // }
  searchAyahs(query: string, page: number = 1, limit: number = 20) {
    const normalizedQuery = query.toLowerCase().trim();

    // ✅ Single pass through pre-built index — no nested loops, no toLowerCase on every call
    const results = searchIndex
      .filter((entry) => entry.searchText.includes(normalizedQuery))
      .map((entry) => ({
        ayah_number: entry.ayah_number,
        arabic_text: entry.arabic_text,
        translation: entry.translation,
        surah_id: entry.surah_id,
        surah_name: entry.surah_name,
      }));

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    return {
      results: results.slice(startIndex, startIndex + limit),
      total,
      page,
      limit,
      totalPages,
    };
  }
  // Validate surah ID
  isValidSurahId(id: number): boolean {
    return id >= 1 && id <= 114;
  }

  // Clear cache
  clearCache(): void {
    cacheService.clear();
  }
}

export const quranService = new QuranService();
