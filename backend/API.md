# Quran API Documentation

## Overview

A scalable, production-ready Quran API built with Hono. Features fast response times, CORS support, rate limiting, pagination, and comprehensive search capabilities.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "status": "ok"
  }
}
```

### API Info

```
GET /api
```

Get API information and available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "API information",
  "data": {
    "name": "Quran API",
    "version": "1.0.0",
    "description": "A scalable Quran API built with Hono",
    "endpoints": {
      "v1": "/api/v1"
    }
  }
}
```

## V1 API

### 1. Get All Surahs

```
GET /api/v1/surahs
```

Returns a list of all 114 surahs with metadata.

**Response:**
```json
{
  "success": true,
  "message": "All surahs retrieved successfully",
  "data": [
    {
      "id": 1,
      "number": 1,
      "name_arabic": "الفاتحة",
      "name_english": "Al-Fatihah",
      "name_transliteration": "Al-Fatiha",
      "revelation_type": "Meccan",
      "total_ayahs": 7,
      "description": "The Opening"
    },
    ...
  ],
  "metadata": {
    "total": 114,
    "api_version": "v1"
  }
}
```

### 2. Get Specific Surah with Ayahs

```
GET /api/v1/surahs/:id
```

Returns a specific surah with all its ayahs. ID is 1-114.

**Example:**
```
GET /api/v1/surahs/1
```

**Response:**
```json
{
  "success": true,
  "message": "Surah Al-Fatihah retrieved successfully",
  "data": {
    "id": 1,
    "number": 1,
    "name_arabic": "الفاتحة",
    "name_english": "Al-Fatihah",
    "name_transliteration": "Al-Fatiha",
    "revelation_type": "Meccan",
    "total_ayahs": 7,
    "description": "The Opening",
    "ayahs": [
      {
        "id": 1,
        "surah": 1,
        "number": 1,
        "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "translation": "In the name of Allah, the Most Gracious, the Most Merciful",
        "transliteration": "Bismillah ar-Rahman ar-Rahim"
      },
      ...
    ]
  },
  "metadata": {
    "ayah_count": 7,
    "revelation_type": "Meccan"
  }
}
```

### 3. Get Specific Ayah

```
GET /api/v1/surahs/:surahId/ayahs/:ayahNumber
```

Returns a specific ayah from a specific surah.

**Example:**
```
GET /api/v1/surahs/1/ayahs/1
```

**Response:**
```json
{
  "success": true,
  "message": "Ayah retrieved successfully",
  "data": {
    "ayah": {
      "id": 1,
      "surah": 1,
      "number": 1,
      "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "translation": "In the name of Allah, the Most Gracious, the Most Merciful",
      "transliteration": "Bismillah ar-Rahman ar-Rahim"
    },
    "surah": {
      "id": 1,
      "name": "Al-Fatihah",
      "number": 1
    }
  }
}
```

### 4. Search Ayahs

```
GET /api/v1/search?q=<query>&page=<page>&limit=<limit>
```

Search ayahs by translation text. Case-insensitive.

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 100)

**Example:**
```
GET /api/v1/search?q=Allah&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "message": "Found 45 results for \"Allah\"",
  "data": {
    "data": [
      {
        "ayah": {
          "id": 1,
          "surah": 1,
          "number": 1,
          "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          "translation": "In the name of Allah, the Most Gracious, the Most Merciful",
          "transliteration": "Bismillah ar-Rahman ar-Rahim"
        },
        "surah_name": "Al-Fatihah",
        "surah_number": 1
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  },
  "metadata": {
    "query": "Allah",
    "api_version": "v1"
  }
}
```

### 5. Advanced Search

```
GET /api/v1/search/advanced?q=<query>&surah_id=<id>&page=<page>&limit=<limit>
```

Search with filters.

**Query Parameters:**
- `q` (required): Search query
- `surah_id` (optional): Filter by specific surah
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 100)

**Example:**
```
GET /api/v1/search/advanced?q=mercy&surah_id=1&page=1&limit=10
```

### 6. Get Statistics

```
GET /api/v1/surahs/stats/overview
```

Get Quran statistics and metadata.

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total_surahs": 114,
    "total_ayahs": 6236,
    "meccan_surahs": 86,
    "medinian_surahs": 28
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit**: 100 requests per minute per IP address
- **Headers**: Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Unix timestamp when the limit resets

If rate limit is exceeded, you'll receive a 429 status code:
```json
{
  "success": false,
  "message": "Too many requests",
  "error": "Rate limit exceeded. Maximum 100 requests per minute."
}
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common Status Codes:**
- `200`: Success
- `400`: Bad request (invalid parameters)
- `404`: Resource not found
- `429`: Rate limit exceeded
- `500`: Server error

## Caching

The API implements intelligent caching:
- All surahs are cached for 1 hour
- Search results are not cached (always fresh)
- Cache is automatically invalidated on server restart

## CORS

CORS is enabled for all origins. For production, modify the CORS configuration in `src/index.ts`:

```typescript
cors({
  origin: ["https://yourdomain.com"], // Specific domains
  allowMethods: ["GET"],
  allowHeaders: ["Content-Type"],
})
```

## Deployment

### Vercel

```bash
npm run build
```

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nodejs"
}
```

### Railway

```bash
npm run build
```

### Render

```bash
npm run build
npm start
```

Set environment variable `PORT=10000` on Render.

## Project Structure

```
backend/
├── src/
│   ├── index.ts           # Main Hono app
│   ├── server.ts          # Node server entry point
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── data/
│       └── quran.json     # Quran dataset
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Features

✅ Fast in-memory caching
✅ Comprehensive search with pagination
✅ Rate limiting per IP
✅ CORS enabled
✅ Error handling
✅ TypeScript support
✅ Modular architecture
✅ Production-ready
✅ API versioning (v1)
✅ Detailed statistics

## License

MIT
