import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Surah {
  id: number;
  name: string;
  name_arabic: string;
  total_ayahs: number;
  revelation_type: string;
}

interface Ayah {
  surah_id: number;
  ayah_number: number;
  arabic_text: string;
  translation: string;
}

interface QuranData {
  surahs: Surah[];
  ayahs: Ayah[];
}

let quranData: QuranData | null = null;
let lastLoadTime = 0;

const loadQuranData = (): QuranData => {
  // Cache for 1 hour in production
  const now = Date.now();
  if (quranData && now - lastLoadTime < 3600000) {
    return quranData;
  }

  const dataPath = join(__dirname, "../data/quran-data.json");
  const data = JSON.parse(readFileSync(dataPath, "utf-8"));
  quranData = data;
  lastLoadTime = now;
  return data;
};

export const QuranService = {
  /**
   * Get all surahs
   */
  getAllSurahs: (): Surah[] => {
    const data = loadQuranData();
    return data.surahs;
  },

  /**
   * Get a specific surah with all its ayahs
   */
  getSurah: (surahId: number): (Surah & { ayahs: Ayah[] }) | null => {
    const data = loadQuranData();
    const surah = data.surahs.find((s) => s.id === surahId);

    if (!surah) {
      return null;
    }

    const ayahs = data.ayahs.filter((a) => a.surah_id === surahId);

    return {
      ...surah,
      ayahs,
    };
  },

  /**
   * Search ayahs by translation text
   */
  searchAyahs: (
    query: string,
    page: number = 1,
    limit: number = 20,
  ): {
    results: (Ayah & { surah_name: string; surah_name_arabic: string })[];
    total: number;
    page: number;
    total_pages: number;
    limit: number;
  } => {
    const data = loadQuranData();
    const lowerQuery = query.toLowerCase();

    // Filter ayahs matching the search query
    const matchedAyahs = data.ayahs.filter((ayah) =>
      ayah.translation.toLowerCase().includes(lowerQuery),
    );

    // Enrich with surah information
    const enrichedResults = matchedAyahs.map((ayah) => {
      const surah = data.surahs.find((s) => s.id === ayah.surah_id);
      return {
        ...ayah,
        surah_name: surah?.name || "Unknown",
        surah_name_arabic: surah?.name_arabic || "Unknown",
      };
    });

    // Paginate results
    const total = enrichedResults.length;
    const total_pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const results = enrichedResults.slice(startIndex, endIndex);

    return {
      results,
      total,
      page,
      total_pages,
      limit,
    };
  },

  /**
   * Get ayahs by surah with pagination
   */
  getAyahsBySurah: (
    surahId: number,
    page: number = 1,
    limit: number = 20,
  ): {
    surah: Surah | null;
    ayahs: Ayah[];
    total: number;
    page: number;
    total_pages: number;
  } => {
    const data = loadQuranData();
    const surah = data.surahs.find((s) => s.id === surahId);

    const ayahs = data.ayahs.filter((a) => a.surah_id === surahId);
    const total = ayahs.length;
    const total_pages = Math.ceil(total / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      surah: surah || null,
      ayahs: ayahs.slice(startIndex, endIndex),
      total,
      page,
      total_pages,
    };
  },

  /**
   * Get specific ayah
   */
  getAyah: (surahId: number, ayahNumber: number): Ayah | null => {
    const data = loadQuranData();
    return (
      data.ayahs.find(
        (a) => a.surah_id === surahId && a.ayah_number === ayahNumber,
      ) || null
    );
  },

  /**
   * Get cache status
   */
  getCacheStatus: () => {
    return {
      cached: quranData !== null,
      total_surahs: quranData?.surahs.length || 0,
      total_ayahs: quranData?.ayahs.length || 0,
      last_load_time: new Date(lastLoadTime).toISOString(),
    };
  },
};
