// API Response Types - TypeScript Interfaces

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    status: number;
  };
}

export interface SurahListResponse {
  surahs: SurahSummary[];
}

export interface SurahSummary {
  id: number;
  name_arabic: string;
  name_english: string;
  name_transliteration: string;
  total_ayahs: number;
}

export interface SurahDetailResponse {
  id: number;
  name_arabic: string;
  name_english: string;
  name_transliteration: string;
  total_ayahs: number;
  revelation_place: string;
  revelation_order: number;
  ayahs: AyahData[];
}

export interface AyahData {
  ayah_number: number;
  arabic_text: string;
  translation: string;
  surah_id?: number;
  surah_name?: string;
}

export interface SearchResult {
  ayah_number: number;
  arabic_text: string;
  translation: string;
  surah_id: number;
  surah_name: string;
}

export interface PaginatedSearchResponse {
  results: SearchResult[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_more: boolean;
  };
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
}
