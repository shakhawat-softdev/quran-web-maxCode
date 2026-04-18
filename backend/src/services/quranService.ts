import { Surah, Ayah, SearchResult } from "../types/index.js";
import { Cache } from "../utils/cache.js";
// @ts-ignore
import quranData from "../data/quran.json" assert { type: "json" };

export class QuranService {
  private static readonly SURAHS_CACHE_KEY = "all_surahs";
  private static readonly SURAH_CACHE_PREFIX = "surah_";
  private static readonly AYAHS_CACHE_KEY = "all_ayahs";

  /**
   * Load all surahs from data
   */
  static getAllSurahs(): Surah[] {
    // Check cache first
    const cached = Cache.get(this.SURAHS_CACHE_KEY);
    if (cached) {
      return cached as Surah[];
    }

    const surahs = (quranData.surahs as unknown as Surah[]);

    // Cache the result
    Cache.set(this.SURAHS_CACHE_KEY, surahs);

    return surahs;
  }

  /**
   * Get surah with all ayahs by ID
   */
  static getSurahById(id: number): Surah | null {
    const cacheKey = `${this.SURAH_CACHE_PREFIX}${id}`;

    // Check cache first
    const cached = Cache.get(cacheKey);
    if (cached) {
      return cached as Surah;
    }

    const surah = (quranData.surahs as unknown as Surah[]).find((s) => s.id === id);

    if (surah) {
      Cache.set(cacheKey, surah);
    }

    return surah || null;
  }

  /**
   * Get all ayahs from all surahs
   */
  static getAllAyahs(): Ayah[] {
    // Check cache first
    const cached = Cache.get(this.AYAHS_CACHE_KEY);
    if (cached) {
      return cached as Ayah[];
    }

    const ayahs: Ayah[] = [];
    quranData.surahs.forEach((surah) => {
      ayahs.push(...surah.ayahs);
    });

    // Cache the result
    Cache.set(this.AYAHS_CACHE_KEY, ayahs);

    return ayahs;
  }

  /**
   * Search ayahs by translation text
   */
  static searchAyahs(query: string): SearchResult[] {
    const allSurahs = this.getAllSurahs();
    const searchQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    allSurahs.forEach((surah) => {
      surah.ayahs.forEach((ayah) => {
        if (
          ayah.translation.toLowerCase().includes(searchQuery) ||
          ayah.text.includes(query) ||
          ayah.transliteration.toLowerCase().includes(searchQuery)
        ) {
          results.push({
            ayah,
            surah_name: surah.name_english,
            surah_number: surah.number,
          });
        }
      });
    });

    return results;
  }

  /**
   * Get surah by number (1-114)
   */
  static getSurahByNumber(number: number): Surah | null {
    return this.getAllSurahs().find((s) => s.number === number) || null;
  }

  /**
   * Get ayahs by surah ID
   */
  static getAyahsBySurahId(surahId: number): Ayah[] {
    const surah = this.getSurahById(surahId);
    return surah ? surah.ayahs : [];
  }

  /**
   * Get ayah by surah and ayah number
   */
  static getAyah(surahId: number, ayahNumber: number): Ayah | null {
    const surah = this.getSurahById(surahId);
    if (!surah) return null;

    return surah.ayahs.find((a) => a.number === ayahNumber) || null;
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    Cache.clear(this.SURAHS_CACHE_KEY);
    Cache.clear(this.AYAHS_CACHE_KEY);
    for (let i = 1; i <= 114; i++) {
      Cache.clear(`${this.SURAH_CACHE_PREFIX}${i}`);
    }
  }

  /**
   * Get statistics
   */
  static getStatistics() {
    const surahs = this.getAllSurahs();
    const ayahs = this.getAllAyahs();

    return {
      total_surahs: surahs.length,
      total_ayahs: ayahs.length,
      meccan_surahs: surahs.filter((s) => s.revelation_type === "Meccan").length,
      medinian_surahs: surahs.filter((s) => s.revelation_type === "Medinian").length,
    };
  }
}
