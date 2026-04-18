// QURAN API USAGE EXAMPLES

const API_BASE_URL = "http://localhost:3000/api/v1";

// ============================================================
// JAVASCRIPT / NODE.JS EXAMPLES
// ============================================================

// 1. Fetch all surahs
async function getAllSurahs() {
  try {
    const response = await fetch(`${API_BASE_URL}/surahs`);
    const result = await response.json();
    console.log("All Surahs:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 2. Fetch specific surah with all ayahs
async function getSurahById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/surahs/${id}`);
    const result = await response.json();
    console.log(`Surah ${id}:`, result.data);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 3. Get specific ayah
async function getAyah(surahId, ayahNumber) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/surahs/${surahId}/ayahs/${ayahNumber}`
    );
    const result = await response.json();
    console.log(`Ayah ${ayahNumber} from Surah ${surahId}:`, result.data);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 4. Search ayahs with pagination
async function searchAyahs(query, page = 1, limit = 10) {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/search?${params}`);
    const result = await response.json();
    console.log(`Search results for "${query}":`, result.data);
    console.log("Pagination:", result.data.pagination);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 5. Advanced search with filters
async function advancedSearch(query, surahId, page = 1, limit = 10) {
  try {
    const params = new URLSearchParams({
      q: query,
      surah_id: surahId.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/search/advanced?${params}`);
    const result = await response.json();
    console.log(
      `Advanced search for "${query}" in Surah ${surahId}:`,
      result.data
    );
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 6. Get statistics
async function getStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/surahs/stats/overview`);
    const result = await response.json();
    console.log("Quran Statistics:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================
// TYPESCRIPT EXAMPLES
// ============================================================

interface Surah {
  id: number;
  number: number;
  name_english: string;
  name_arabic: string;
  total_ayahs: number;
}

interface Ayah {
  id: number;
  surah: number;
  number: number;
  text: string;
  translation: string;
  transliteration: string;
}

class QuranAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3000/api/v1") {
    this.baseUrl = baseUrl;
  }

  async getAllSurahs(): Promise<Surah[]> {
    const response = await fetch(`${this.baseUrl}/surahs`);
    const result = await response.json();
    return result.data;
  }

  async getSurahById(id: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/surahs/${id}`);
    const result = await response.json();
    return result.data;
  }

  async getAyah(
    surahId: number,
    ayahNumber: number
  ): Promise<{ ayah: Ayah; surah: { id: number; name: string; number: number } }> {
    const response = await fetch(
      `${this.baseUrl}/surahs/${surahId}/ayahs/${ayahNumber}`
    );
    const result = await response.json();
    return result.data;
  }

  async searchAyahs(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseUrl}/search?${params}`);
    return response.json();
  }

  async getStatistics(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/surahs/stats/overview`);
    const result = await response.json();
    return result.data;
  }
}

// Usage
const client = new QuranAPIClient("http://localhost:3000/api/v1");

// ============================================================
// CURL EXAMPLES (Terminal)
// ============================================================

/*

# 1. Get all surahs
curl http://localhost:3000/api/v1/surahs

# 2. Get specific surah
curl http://localhost:3000/api/v1/surahs/1

# 3. Get specific ayah
curl http://localhost:3000/api/v1/surahs/1/ayahs/1

# 4. Search ayahs
curl "http://localhost:3000/api/v1/search?q=Allah"

# 5. Search with pagination
curl "http://localhost:3000/api/v1/search?q=mercy&page=1&limit=20"

# 6. Advanced search
curl "http://localhost:3000/api/v1/search/advanced?q=grace&surah_id=1"

# 7. Get statistics
curl http://localhost:3000/api/v1/surahs/stats/overview

# 8. Check rate limiting headers
curl -i http://localhost:3000/api/v1/surahs

# 9. With custom headers
curl -H "Content-Type: application/json" \
  http://localhost:3000/api/v1/surahs

*/

// ============================================================
// REACT EXAMPLE
// ============================================================

/*

import { useState, useEffect } from 'react';

function QuranSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResults(data.data?.data || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Quran..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      <div>
        {results.map((result) => (
          <div key={result.ayah.id}>
            <p>{result.ayah.text}</p>
            <p>{result.ayah.translation}</p>
            <small>{result.surah_name} - Ayah {result.ayah.number}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuranSearch;

*/

// ============================================================
// PYTHON EXAMPLE
// ============================================================

/*

import requests
import json

API_BASE_URL = "http://localhost:3000/api/v1"

# 1. Get all surahs
def get_all_surahs():
    response = requests.get(f"{API_BASE_URL}/surahs")
    return response.json()

# 2. Get specific surah
def get_surah(surah_id):
    response = requests.get(f"{API_BASE_URL}/surahs/{surah_id}")
    return response.json()

# 3. Search ayahs
def search_ayahs(query, page=1, limit=10):
    params = {
        'q': query,
        'page': page,
        'limit': limit
    }
    response = requests.get(f"{API_BASE_URL}/search", params=params)
    return response.json()

# Usage
surahs = get_all_surahs()
print(json.dumps(surahs, indent=2))

surah = get_surah(1)
print(json.dumps(surah, indent=2))

results = search_ayahs("Allah", page=1, limit=20)
print(json.dumps(results, indent=2))

*/

// ============================================================
// RUN EXAMPLES
// ============================================================

// Uncomment to run examples:

// getAllSurahs();
// getSurahById(1);
// getAyah(1, 1);
// searchAyahs("Allah");
// advancedSearch("mercy", 1);
// getStatistics();

// Or use TypeScript client:
// client.getAllSurahs().then(surahs => console.log(surahs));
// client.getSurahById(1).then(surah => console.log(surah));
// client.searchAyahs("Allah").then(results => console.log(results));
