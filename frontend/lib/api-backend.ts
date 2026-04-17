/**
 * Backend API Configuration
 * Connects to the Quran API backend running on port 3000
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_V1 = `${API_BASE_URL}/api/v1`;

/**
 * Fetch with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_V1}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API error: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Get all surahs from backend
 */
export async function getSurahs() {
  try {
    const response = await apiFetch("/surahs");
    return response;
  } catch (error) {
    console.error("Failed to fetch surahs:", error);
    throw error;
  }
}

/**
 * Get a single surah by ID from backend
 */
export async function getSurahById(id: number) {
  try {
    const response = await apiFetch(`/surah/${id}`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch surah ${id}:`, error);
    throw error;
  }
}

/**
 * Search ayahs from backend
 */
export async function searchAyahs(
  query: string,
  page: number = 1,
  limit: number = 20,
) {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: Math.min(limit, 100).toString(),
    });

    const response = await apiFetch(`/search?${params}`);
    return response;
  } catch (error) {
    console.error("Failed to search ayahs:", error);
    throw error;
  }
}

/**
 * Get API health status
 */
export async function getAPIHealth() {
  try {
    const response = await apiFetch("/health");
    return response;
  } catch (error) {
    console.error("Failed to check API health:", error);
    throw error;
  }
}

/**
 * Get API info
 */
export async function getAPIInfo() {
  try {
    const response = await apiFetch("/info");
    return response;
  } catch (error) {
    console.error("Failed to fetch API info:", error);
    throw error;
  }
}
