import { type Surah, type Ayah } from "@/lib/quran-data";

// Get backend API URL from environment or default to local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Backend response types
interface BackendSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface BackendAyah {
  number: number;
  surah: number;
  numberInSurah: number;
  text: string;
  translation: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

interface SurahListResponse {
  surahs?: BackendSurah[];
  [key: string]: any;
}

interface SurahDetailResponse {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: BackendAyah[];
}

interface SearchResponse {
  results: BackendAyah[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Mapping functions
function mapBackendSurahToFrontend(surah: BackendSurah): Surah {
  return {
    number: surah.number,
    name: surah.name,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    numberOfAyahs: surah.numberOfAyahs,
    revelationType: surah.revelationType,
  };
}

function mapBackendAyahToFrontend(ayah: BackendAyah): Ayah {
  return {
    number: ayah.number,
    text: ayah.text,
    translation: ayah.translation,
    surah: ayah.surah,
  };
}

/**
 * Get all surahs (for SSG on home page)
 */
export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/surahs`, {
      // next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch surahs: ${response.statusText}`);
    }

    const data: ApiResponse<any> = await response.json();

    if (!data.success) {
      throw new Error("Invalid API response format");
    }

    // Extract surahs from response
    const backendSurahs =
      data.data.surahs || (Array.isArray(data.data) ? data.data : []);

    if (!Array.isArray(backendSurahs)) {
      throw new Error("Invalid surahs data format");
    }

    return backendSurahs.map(mapBackendSurahToFrontend);
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw error;
  }
}

/**
 * Get a single surah by number
 */
export async function getSurahById(id: number): Promise<Surah | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/surah/${id}`, {
      // next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${id}: ${response.statusText}`);
    }

    const data: ApiResponse<SurahDetailResponse> = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid API response format");
    }

    return mapBackendSurahToFrontend(data.data);
  } catch (error) {
    console.error(`Error fetching surah ${id}:`, error);
    return null;
  }
}

/**
 * Get surah detail with ayahs
 */
export async function getSurahDetail(
  id: number,
): Promise<{ surah: Surah; ayahs: Ayah[] } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/surah/${id}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${id}: ${response.statusText}`);
    }

    const data: ApiResponse<SurahDetailResponse> = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid API response format");
    }

    const backendSurah = data.data;
    const surah = mapBackendSurahToFrontend(backendSurah);
    const ayahs = (backendSurah.ayahs || []).map(mapBackendAyahToFrontend);

    return { surah, ayahs };
  } catch (error) {
    console.error(`Error fetching surah detail ${id}:`, error);
    throw error;
  }
}

/**
 * Get ayahs for a specific surah
 */
export async function getAyahsBySurah(surahNumber: number): Promise<Ayah[]> {
  try {
    const result = await getSurahDetail(surahNumber);
    return result?.ayahs || [];
  } catch (error) {
    console.error(`Error fetching ayahs for surah ${surahNumber}:`, error);
    return [];
  }
}

/**
 * Search ayahs by query
 */
export async function searchAyahs(
  query: string,
  page: number = 1,
  limit: number = 20,
): Promise<{
  results: Ayah[];
  total: number;
  page: number;
  totalPages: number;
}> {
  if (!query || query.trim().length === 0) {
    return { results: [], total: 0, page: 1, totalPages: 0 };
  }

  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/v1/search?${params}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 1 minute for search
    });

    if (!response.ok) {
      throw new Error(`Failed to search: ${response.statusText}`);
    }

    const data: any = await response.json();

    if (!data.success) {
      throw new Error("Invalid API response format");
    }

    // Backend returns data as array and metadata separately
    const results = Array.isArray(data.data) ? data.data : [];
    const metadata = data.metadata || { total: 0, page: 1, limit: 20 };
    const totalPages = Math.ceil(metadata.total / metadata.limit);

    return {
      results: results.map(mapBackendAyahToFrontend),
      total: metadata.total,
      page: metadata.page,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("Error searching ayahs:", error);
    return { results: [], total: 0, page: 1, totalPages: 0 };
  }
}

/**
 * Get all surah numbers for static generation
 */
export async function getAllSurahNumbers(): Promise<number[]> {
  try {
    const surahs = await getSurahs();
    return surahs.map((s) => s.number);
  } catch (error) {
    console.error("Error fetching surah numbers:", error);
    return [];
  }
}
