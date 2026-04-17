import { surahs, ayahsBySurah, type Surah, type Ayah } from './quran-data';

/**
 * Get all surahs (for SSG on home page)
 */
export async function getSurahs(): Promise<Surah[]> {
  // Simulate async API call
  return Promise.resolve(surahs);
}

/**
 * Get a single surah by number
 */
export async function getSurahById(id: number): Promise<Surah | null> {
  const surah = surahs.find(s => s.number === id);
  return Promise.resolve(surah || null);
}

/**
 * Get ayahs for a specific surah
 */
export async function getAyahsBySurah(surahNumber: number): Promise<Ayah[]> {
  const ayahs = ayahsBySurah[surahNumber] || [];
  return Promise.resolve(ayahs);
}

/**
 * Search ayahs by query (searches in both Arabic text and translation)
 */
export async function searchAyahs(query: string): Promise<Ayah[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const results: Ayah[] = [];

  // Search through all available ayahs
  Object.values(ayahsBySurah).forEach(surahAyahs => {
    surahAyahs.forEach(ayah => {
      if (
        ayah.text.toLowerCase().includes(lowerQuery) ||
        ayah.translation.toLowerCase().includes(lowerQuery)
      ) {
        results.push(ayah);
      }
    });
  });

  return Promise.resolve(results);
}

/**
 * Get all surah numbers for static generation
 */
export async function getAllSurahNumbers(): Promise<number[]> {
  return Promise.resolve(surahs.map(s => s.number));
}
