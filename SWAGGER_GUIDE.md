# Swagger API Documentation Setup ✅

Your Quran API now has **fully integrated Swagger UI documentation**!

## 🚀 Access the Documentation

### 1. **Interactive Swagger UI** (Recommended)

```
http://localhost:3000/api-docs
```

- Full interactive API documentation
- Test endpoints directly from the browser
- View request/response examples
- Schema definitions
- Try it out buttons for each endpoint

### 2. **Raw OpenAPI Schema (JSON)**

```
http://localhost:3000/openapi.json
```

- Machine-readable OpenAPI 3.0.0 specification
- Use with tools like Postman, Insomnia, or any OpenAPI client
- Import into other API documentation tools

### 3. **API Info Endpoint** (Legacy)

```
http://localhost:3000/api/v1/info
```

- Basic API information and endpoint list
- Still available for backward compatibility

---

## 📋 What's Documented

### **Endpoints** (5 main)

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| GET    | `/api/v1/surahs`     | Get all 114 Surahs            |
| GET    | `/api/v1/surah/{id}` | Get specific Surah with Ayahs |
| GET    | `/api/v1/search`     | Search Ayahs by text          |
| GET    | `/api/v1/health`     | Health check                  |
| GET    | `/api/v1/info`       | API information               |

### **Schemas** (5 defined)

- `Surah` - Basic Surah metadata
- `SurahDetail` - Surah with full Ayahs
- `Ayah` - Individual verse structure
- `SearchResult` - Search result object
- `Error` - Standard error response

### **Features in OpenAPI Schema**

✅ Complete endpoint documentation  
✅ Parameter descriptions with types and examples  
✅ Request/response schemas  
✅ HTTP status codes (200, 400, 404, 429, 500)  
✅ Rate limiting information  
✅ CORS headers  
✅ Multiple server configurations  
✅ Example responses

---

## 🔧 Technical Details

### **OpenAPI Version**

```
3.0.0 - Industry standard API documentation format
```

### **Servers Configured**

```
Development: http://localhost:3000
Production: https://api.example.com (placeholder)
```

### **Security**

```
Rate Limiting headers included in all responses:
- X-RateLimit-Limit: 100
- X-RateLimit-Remaining: [remaining]
```

---

## 💡 How to Use Swagger UI

### **View Endpoint Details**

1. Click on any endpoint to expand it
2. See the full description, parameters, and responses
3. View example requests and responses

### **Test an Endpoint**

1. Click "Try it out" on any endpoint
2. Fill in any required parameters
3. Click "Execute"
4. See the response status, headers, and body

### **Explore Schemas**

1. Scroll to the bottom to see "Schemas"
2. Click on any schema to see its structure
3. Understand the data types and required fields

### **Copy Endpoint**

1. Use the "Copy to clipboard" button next to each endpoint
2. Paste into your code or API client

---

## 📦 Files Created/Modified

### **New Files**

```
src/routes/openapi-schema.ts  - OpenAPI 3.0.0 schema definition
```

### **Modified Files**

```
package.json                  - Added @hono/swagger-ui dependency
src/routes/index.ts           - Integrated Swagger UI routes
src/index.ts                  - Added Swagger UI log message
```

### **Dependencies Added**

```
@hono/swagger-ui: ^0.3.0  - Official Hono Swagger UI middleware
```

---

## 🌐 Integration Points

The Swagger documentation is automatically served at:

- **GET** `/api-docs` - Interactive Swagger UI
- **GET** `/openapi.json` - OpenAPI schema JSON

Both endpoints are:

- ✅ Rate limited (same as other endpoints)
- ✅ CORS enabled
- ✅ Cached appropriately
- ✅ Always available

---

## 📱 Use with Other Tools

### **Postman**

1. Import from URL: `http://localhost:3000/openapi.json`
2. All endpoints auto-configured

### **Insomnia**

1. Create request from OpenAPI URL
2. Paste: `http://localhost:3000/openapi.json`

### **ReDoc** (Alternative UI)

```
https://redocly.github.io/redoc/?url=http://localhost:3000/openapi.json
```

### **VS Code REST Client**

```
@url = http://localhost:3000
@apiBase = {{url}}/api/v1

### Get all Surahs
GET {{apiBase}}/surahs
```

---

## 📊 Example Requests

### **Get All Surahs**

```http
GET /api/v1/surahs HTTP/1.1
Host: localhost:3000
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Al-Fatihah",
      "englishName": "The Opening",
      "englishNameTranslation": "The Key to the Qur'an",
      "numberOfAyahs": 7,
      "revelationType": "Meccan"
    }
    // ... 113 more Surahs
  ],
  "metadata": {
    "total": 114,
    "cached": true,
    "timestamp": "2024-04-17T..."
  }
}
```

### **Search Ayahs**

```http
GET /api/v1/search?q=mercy&page=1&limit=20 HTTP/1.1
Host: localhost:3000
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "ayahNumber": 123,
      "surahNumber": 7,
      "surahName": "Al-A'raf",
      "ayahNumberInSurah": 56,
      "text": "إن رحمة الله قريب من المحسنين",
      "translation": "Indeed, the mercy of Allah is near to those who do good",
      "relevance": 0.98
    }
    // ... more results
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## ✨ Next Steps

1. ✅ **Swagger UI integrated** - Access at `/api-docs`
2. ✅ **OpenAPI schema defined** - Complete documentation
3. ✅ **All endpoints documented** - With examples
4. Next: Deploy to production platform (Vercel/Railway/Render)
5. Next: Connect frontend to backend API

---

**Status**: ✅ Swagger API documentation fully integrated and tested!
