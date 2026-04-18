export interface Ayah {
  id: number;
  surah: number;
  number: number;
  text: string;
  translation: string;
  transliteration: string;
}

export interface Surah {
  id: number;
  number: number;
  name_arabic: string;
  name_english: string;
  name_transliteration: string;
  revelation_type: "Meccan" | "Medinian";
  total_ayahs: number;
  description: string;
  ayahs: Ayah[];
}

export interface SearchResult {
  ayah: Ayah;
  surah_name: string;
  surah_number: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  metadata?: Record<string, unknown>;
  error?: string;
}
