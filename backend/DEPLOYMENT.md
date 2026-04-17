# Quran API - Deployment Guide

## Overview
The Quran API is a scalable backend service built with Hono, featuring fast responses, in-memory caching, search capabilities, and rate limiting. This guide covers deployment to multiple platforms.

## Architecture Features
- **Framework**: Hono (lightweight, fast edge runtime support)
- **Caching**: In-memory caching with TTL support
- **Search**: Full-text search on ayahs with pagination
- **Rate Limiting**: Configurable per-IP rate limiting (100 req/15min default)
- **CORS**: Enabled for cross-origin requests
- **Error Handling**: Comprehensive error responses
- **API Versioning**: `/api/v1/` endpoints

## Project Structure
```
backend/
├── src/
│   ├── index.ts              # Main application entry
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic (Quran, Cache)
│   ├── middleware/           # CORS, logging, rate limiting
│   ├── routes/               # API route definitions
│   ├── data/                 # Quran dataset
│   ├── types/                # TypeScript types
│   └── utils/                # Configuration and utilities
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── Dockerfile                # Container build
├── docker-compose.yml        # Local dev environment
├── vercel.json               # Vercel deployment
├── railway.json              # Railway deployment
├── render.yaml               # Render deployment
└── .env.example              # Environment template
```

## Local Development

### Prerequisites
- Node.js 18+ (check with: `node --version`)
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run development server with hot reload
npm run dev

# Or with Docker
docker-compose up
```

The API will be available at `http://localhost:3000`

### Available Scripts
```bash
npm run dev      # Start with hot reload (tsx watch)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled application
npm run serve    # Build and start
```

## API Endpoints

### Get All Surahs
```bash
GET /api/v1/surahs

# Response
{
  "success": true,
  "data": {
    "surahs": [
      {
        "id": 1,
        "name_arabic": "الفاتحة",
        "name_english": "The Opening",
        "name_transliteration": "Al-Fatihah",
        "total_ayahs": 7
      }
    ]
  },
  "metadata": {
    "total": 114
  }
}
```

### Get Surah with Ayahs
```bash
GET /api/v1/surah/:id

# Example: GET /api/v1/surah/1
# Returns surah details with all ayahs
```

### Search Ayahs
```bash
GET /api/v1/search?q=mercy&page=1&limit=20

# Response includes pagination metadata
{
  "success": true,
  "data": [
    {
      "ayah_number": 1,
      "arabic_text": "...",
      "translation": "...",
      "surah_id": 1,
      "surah_name": "The Opening"
    }
  ],
  "metadata": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

### Health Check
```bash
GET /api/v1/health
```

### API Info
```bash
GET /api/v1/info
```

## Deployment Platforms

### 1. Vercel (Recommended for Serverless)

**Pros**: Free tier, auto-scaling, global CDN, instant deployments
**Cons**: Cold starts on serverless, stateless only

#### Steps:
1. Create account at vercel.com
2. Connect your GitHub repository
3. Set environment variables in project settings
4. Deploy button appears - click to deploy

**Environment Variables**:
```
NODE_ENV=production
PORT=3000
RATE_LIMIT_MAX=100
```

**URL**: `https://your-project.vercel.app/api/v1/...`

**Note**: Vercel's free tier works best with Hono. Vercel's Node.js runtime is optimized for Hono deployments.

### 2. Railway (Recommended for Always-On)

**Pros**: Easy deployment, good free tier, proper container support
**Cons**: Limited free tier resources

#### Steps:
1. Create account at railway.app
2. Connect GitHub repository or use `railway init`
3. Railway auto-detects Node.js project
4. Deploy with `railway up` or via dashboard

**Local Deployment**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

**Environment Variables** (set in Railway dashboard):
```
NODE_ENV=production
PORT=3000
RATE_LIMIT_MAX=100
```

**URL**: `https://your-project.up.railway.app/api/v1/...`

### 3. Render (Alternative Always-On)

**Pros**: Built-in database support, good documentation
**Cons**: More expensive than Railway, longer cold starts

#### Steps:
1. Create account at render.com
2. Click "New Web Service"
3. Connect GitHub repository
4. Select Node runtime
5. Update `render.yaml` with your configuration
6. Deploy

**Configuration** in `render.yaml` is pre-configured.

**Environment Variables**:
```
NODE_ENV=production
PORT=3000
```

**URL**: `https://your-project.onrender.com/api/v1/...`

### 4. Docker Deployment (AWS, GCP, Digital Ocean, etc.)

#### Using Docker Directly:
```bash
# Build image
docker build -t quran-api:latest .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  quran-api:latest
```

#### AWS Deployment Example:
```bash
# Create ECR repository
aws ecr create-repository --repository-name quran-api

# Push image to ECR
docker tag quran-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/quran-api:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/quran-api:latest

# Deploy to ECS Fargate or EC2
```

## Configuration

### Environment Variables
Copy `.env.example` to `.env` and customize:

```bash
# Node environment
NODE_ENV=production

# Server
PORT=3000
HOST=0.0.0.0

# Caching (milliseconds)
CACHE_TTL=3600000  # 1 hour

# Rate Limiting
RATE_LIMIT_WINDOW=900000   # 15 minutes
RATE_LIMIT_MAX=100         # requests per window

# Logging
LOG_LEVEL=info
```

### Rate Limiting Tuning
- For public APIs: `RATE_LIMIT_MAX=50` (stricter)
- For internal APIs: `RATE_LIMIT_MAX=500` (lenient)
- Default: `RATE_LIMIT_MAX=100` (balanced)

### Cache TTL Tuning
- Static data (surahs): Can use longer TTL (1 hour default)
- Search results: Consider shorter TTL if data changes
- Default: 3600000ms (1 hour)

## Monitoring

### Health Checks
All platforms support health checks via:
```
GET /api/v1/health
```

### Logging
Server logs are printed to stdout and can be viewed via:
- **Vercel**: Analytics dashboard
- **Railway**: Deployment logs in dashboard
- **Render**: Logs tab in service details
- **Docker**: `docker logs <container-id>`

### Response Headers
API includes helpful headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
Access-Control-Allow-Origin: *
```

## Performance Optimization

### Current Optimizations
1. **In-Memory Caching**: Surah list cached for 1 hour
2. **Pagination**: Search results paginated (default 20 per page, max 100)
3. **Index Cache**: All surahs pre-loaded in memory on startup
4. **Efficient Search**: Case-insensitive substring search with early termination

### Future Optimization Options
1. **Redis Caching**: Replace in-memory cache with Redis
   ```typescript
   // Would reduce memory footprint on horizontal scaling
   ```
2. **Database Indexing**: Full-text search index in PostgreSQL/MongoDB
3. **API Response Compression**: gzip middleware
4. **CDN Caching Headers**: Cache-Control headers for public endpoints

## Troubleshooting

### Port Already in Use
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Connection Refused
- Check if server is running: `npm run dev`
- Verify PORT environment variable
- Check firewall settings

### High Memory Usage
- Monitor with `node --max-old-space-size=512`
- Increase cache TTL to reduce refresh frequency
- Consider external cache (Redis)

### Rate Limiting Issues
- Check client IP header forwarding (X-Forwarded-For)
- Adjust RATE_LIMIT_MAX for your use case
- Review rate limit headers in response

## Testing

### Manual API Testing

**Using curl**:
```bash
# Get all surahs
curl http://localhost:3000/api/v1/surahs

# Get surah 1
curl http://localhost:3000/api/v1/surah/1

# Search for "mercy"
curl "http://localhost:3000/api/v1/search?q=mercy&page=1&limit=10"

# Health check
curl http://localhost:3000/api/v1/health
```

**Using Postman/Insomnia**:
1. Import API endpoints
2. Set base URL to your deployment
3. Test each endpoint

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 100 http://localhost:3000/api/v1/surahs

# Using wrk
wrk -t4 -c100 -d30s http://localhost:3000/api/v1/surahs
```

## Next Steps

### Scaling to Production
1. **Add Database**: Integrate PostgreSQL for persistent search index
2. **Redis Cache**: Replace in-memory cache for distributed deployments
3. **API Keys**: Add authentication for premium endpoints
4. **Analytics**: Track endpoint usage and performance
5. **CDN**: Use Cloudflare for edge caching
6. **Monitoring**: Set up alerts with Sentry or New Relic

### Data Enhancement
1. Extend Quran dataset with full 6236 ayahs
2. Add multiple translations
3. Add tafsir (commentary)
4. Add audio URLs for recitation

### API Extensions
1. Add morphological analysis
2. Add letter-by-letter breakdown
3. Add word frequency analysis
4. Add cross-references between surahs

## Support & Resources

- **Hono Documentation**: https://hono.dev
- **Vercel Documentation**: https://vercel.com/docs
- **Railway Documentation**: https://docs.railway.app
- **Render Documentation**: https://render.com/docs
- **Docker Documentation**: https://docs.docker.com

## License
MIT
