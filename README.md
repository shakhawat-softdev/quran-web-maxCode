# Quran Web Application

A full-stack Quran application with a Next.js 14 frontend and Node.js/Hono backend API. Features include full-text search, caching, rate limiting, and comprehensive API documentation.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+

### Installation

1. **Install Backend Dependencies**

```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**

```bash
cd frontend
npm install
```

## 📋 Running the Application

### Start Backend API (Port 3000)

From the `backend` directory:

```bash
npm run dev
```

The backend will start on **http://localhost:3000**

**Output:**

```
🚀 Quran API Server starting...
🔗 Listening on http://0.0.0.0:3000
📖 Swagger UI Documentation: http://0.0.0.0:3000/api-docs
💾 Cache TTL: 3600000ms
🛡️ Rate Limit: 100 requests per 900000ms
```

### Start Frontend Application (Port 3001)

From the `frontend` directory:

```bash
npm run dev -- -p 3001
```

The frontend will start on **http://localhost:3001**

**Output:**

```
▲ Next.js 16.2.4 (Turbopack)
- Local:         http://localhost:3001
- Network:       http://192.168.0.102:3001
✓ Ready in 800ms
```

## 🌐 Access Points

| Service            | URL                                | Purpose                       |
| ------------------ | ---------------------------------- | ----------------------------- |
| **Frontend App**   | http://localhost:3001              | Next.js 14 Application        |
| **Backend API**    | http://localhost:3000              | Quran API Server              |
| **Swagger UI**     | http://localhost:3000/api-docs     | Interactive API Documentation |
| **OpenAPI Schema** | http://localhost:3000/openapi.json | Machine-readable API schema   |

## 📚 API Endpoints

All endpoints are prefixed with `/api/v1`

### Surahs (Chapters)

```
GET /api/v1/surahs
```

Get all 114 Surahs of the Quran with metadata.

**Example:**

```bash
curl http://localhost:3000/api/v1/surahs
```

### Surah Details

```
GET /api/v1/surah/:id
```

Get a specific Surah with all its Ayahs (verses).

**Example:**

```bash
curl http://localhost:3000/api/v1/surah/1
```

### Search Ayahs

```
GET /api/v1/search?q=mercy&page=1&limit=20
```

Search Ayahs by text with pagination.

**Parameters:**

- `q` (string, required) - Search query
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Results per page (default: 20, max: 100)

**Example:**

```bash
curl "http://localhost:3000/api/v1/search?q=mercy&page=1&limit=20"
```

### Health Check

```
GET /api/v1/health
```

Check API server health status.

### API Info

```
GET /api/v1/info
```

Get general API information and available endpoints.

## 📖 Swagger API Documentation

Access the interactive API documentation at: **http://localhost:3000/api-docs**

Features:

- ✅ Interactive endpoint testing
- ✅ Request/response examples
- ✅ Schema definitions
- ✅ Parameter validation rules
- ✅ Try It Out buttons

## 🛠️ Using the Backend API in Frontend

The frontend has a pre-configured API client in `lib/api-backend.ts`:

```typescript
import { getSurahs, getSurahById, searchAyahs } from "@/lib/api-backend";

// Fetch all surahs
const surahs = await getSurahs();

// Fetch specific surah with ayahs
const surah = await getSurahById(1);

// Search ayahs with pagination
const results = await searchAyahs("mercy", 1, 20);
```

## ⚙️ Configuration

### Backend Environment Variables

Create or update `.env` in the backend directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Cache Configuration
CACHE_TTL=3600000  # 1 hour in milliseconds

# Rate Limiting Configuration
RATE_LIMIT_MAX=100        # Max requests
RATE_LIMIT_WINDOW=900000  # Time window in milliseconds (15 minutes)
```

### Frontend Environment Variables

Create or update `.env.local` in the frontend directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📁 Project Structure

```
quran-web-maxCode/
├── backend/                    # Node.js/Hono API Server
│   ├── src/
│   │   ├── index.ts           # Main app entry point
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes + OpenAPI schema
│   │   ├── middleware/        # CORS, logging, rate limiting
│   │   ├── data/              # Quran dataset
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Utilities
│   ├── dist/                  # Compiled JavaScript
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js 14 Application
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   ├── lib/
│   │   ├── api-backend.ts    # Backend API client
│   │   └── quran-data.ts     # Local Quran data
│   ├── public/                # Static assets
│   ├── .env.local            # Local environment
│   ├── next.config.mjs       # Next.js configuration
│   ├── package.json
│   └── tsconfig.json
│
├── README.md                  # This file
└── .gitignore                # Git ignore rules
```

## 🔄 Development Workflow

### Terminal 1: Backend

```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev -- -p 3001
# Runs on http://localhost:3001
```

### Terminal 3: Optional - Swagger UI Testing

Open browser to **http://localhost:3000/api-docs** to test API endpoints interactively.

## 🏗️ Building for Production

### Build Backend

```bash
cd backend
npm run build
npm start
```

### Build Frontend

```bash
cd frontend
npm run build
npm start
```

## 📦 Deployment

The application is configured for deployment on multiple platforms:

- **Vercel** - Optimized for Next.js frontend
- **Railway** - Full stack support
- **Render** - Full stack support
- **Docker** - Containerized deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🐛 Troubleshooting

### Port Already in Use

**Backend (3000):**

```bash
# Set different port
$env:PORT=3001
npm run dev
```

**Frontend (3001):**

```bash
# Use different port
npm run dev -- -p 3002
```

### Dependencies Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API Requests Failing

1. Ensure backend is running on http://localhost:3000
2. Check `.env.local` in frontend for correct `NEXT_PUBLIC_API_URL`
3. Verify CORS headers in browser console
4. Check rate limiting (100 requests per 15 minutes)

### TypeScript Errors

```bash
# Rebuild TypeScript
cd backend
npm run build
```

## 📊 Features

✅ **Full-Text Search** - Search Quran by Arabic text or English translation  
✅ **Pagination** - Results pagination with configurable page size (1-100)  
✅ **Caching** - In-memory cache with TTL for performance  
✅ **Rate Limiting** - 100 requests per 15 minutes per IP  
✅ **CORS Enabled** - Cross-origin requests supported  
✅ **API Documentation** - Swagger UI + OpenAPI schema  
✅ **TypeScript** - Full type safety on both frontend and backend  
✅ **Error Handling** - Comprehensive error responses with status codes

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "metadata": {
    "timestamp": "2024-04-17T10:30:00Z",
    "cached": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Max 100 requests per 900000ms",
    "status": 429
  }
}
```

## 🔐 Security

- **CORS**: Restricted to specific origins in production
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All API parameters validated
- **Error Handling**: No sensitive data in error messages

## 📚 Resources

- [Quran API Documentation](./SWAGGER_GUIDE.md)
- [Migration Guide](./frontend/MIGRATION_GUIDE.md)
- [Project Structure](./frontend/PROJECT_STRUCTURE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hono Framework Documentation](https://hono.dev)

## 📄 License

MIT - See LICENSE file for details

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review API documentation at http://localhost:3000/api-docs
3. Check console logs in both frontend and backend terminals

---

**Happy Quran studying!** 📖✨
