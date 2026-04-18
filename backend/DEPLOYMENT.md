# Deployment Guide

Complete instructions for deploying the Quran API to various platforms.

## Local Development

### Using npm

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server running at http://localhost:3000
```

### Using Docker

```bash
# Build and run with Docker
docker build -t quran-api .
docker run -p 3000:3000 quran-api

# Or use Docker Compose
docker-compose up
```

## Production Deployment

### 1. Vercel (Recommended for Hono)

Vercel has native support for Hono applications.

**Step 1:** Create `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nodejs",
  "nodeVersion": "20.x"
}
```

**Step 2:** Push to GitHub

```bash
git add .
git commit -m "Add Quran API"
git push origin main
```

**Step 3:** Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your repository
3. Framework Preset: **Other**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click Deploy

**Environment Variables:**
```
PORT=3000
NODE_ENV=production
```

**Deploy URL:** `https://your-project.vercel.app/api/v1/surahs`

### 2. Railway

Railway is great for Node.js APIs.

**Step 1:** Push to GitHub

**Step 2:** Connect to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository

**Step 3:** Configure

```
Build Command: npm run build
Start Command: npm start
```

**Environment Variables:**
```
PORT=8000
NODE_ENV=production
```

**Custom Domain:**
- Go to Settings → Custom Domain
- Add your domain

**Deploy URL:** `https://your-railway-domain.railway.app/api/v1/surahs`

### 3. Render

Render offers a free tier with good performance.

**Step 1:** Connect GitHub

1. Go to https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository

**Step 2:** Configure

```
Name: quran-api
Environment: Node
Build Command: npm run build
Start Command: npm start
```

**Environment Variables:**
```
PORT=10000
NODE_ENV=production
```

**Deploy URL:** `https://your-render-service.onrender.com/api/v1/surahs`

### 4. AWS

**Option A: Using Elastic Beanstalk**

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-20 quran-api

# Create environment
eb create quran-api-env

# Deploy
eb deploy

# View logs
eb logs

# Monitor
eb status
```

**Option B: Using Lambda + API Gateway**

Requires restructuring for serverless. See AWS documentation.

### 5. Google Cloud Run

**Step 1:** Install Cloud SDK

```bash
curl https://sdk.cloud.google.com | bash
gcloud init
```

**Step 2:** Deploy

```bash
# Build
npm run build

# Deploy to Cloud Run
gcloud run deploy quran-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 60s
```

**Environment Variables:**
```
PORT=8080
NODE_ENV=production
```

### 6. Azure App Service

**Step 1:** Install Azure CLI

```bash
# Install from https://aka.ms/installazurecliwindows or use package manager
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

**Step 2:** Deploy

```bash
# Login
az login

# Create resource group
az group create --name quran-api-rg --location eastus

# Create app service plan
az appservice plan create --name quran-api-plan --resource-group quran-api-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group quran-api-rg --plan quran-api-plan --name quran-api --runtime "NODE|20"

# Deploy
az webapp deployment source config-zip --resource-group quran-api-rg --name quran-api --src dist.zip
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t quran-api:latest .
```

### Run Docker Container

```bash
docker run \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  quran-api:latest
```

### Docker Registry (Docker Hub)

```bash
# Login
docker login

# Tag image
docker tag quran-api:latest username/quran-api:latest

# Push
docker push username/quran-api:latest

# Pull on server
docker pull username/quran-api:latest
docker run -p 3000:3000 username/quran-api:latest
```

## Kubernetes Deployment

**Step 1:** Create `k8s-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: quran-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: quran-api
  template:
    metadata:
      labels:
        app: quran-api
    spec:
      containers:
      - name: quran-api
        image: quran-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: quran-api-service
spec:
  type: LoadBalancer
  selector:
    app: quran-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

**Step 2:** Deploy

```bash
kubectl apply -f k8s-deployment.yaml
```

## Load Testing

Test your deployment with Apache Bench or wrk:

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://your-api.com/api/v1/surahs

# Using wrk
wrk -t12 -c400 -d30s https://your-api.com/api/v1/surahs
```

## Monitoring & Logging

### View Logs

**Vercel:**
```bash
vercel logs
```

**Railway:**
- Dashboard → Logs tab

**Render:**
- Service → Logs

**Cloud Run:**
```bash
gcloud run services describe quran-api
```

### Performance Monitoring

Add monitoring services:
- **New Relic**: https://newrelic.com
- **Datadog**: https://datadog.com
- **Sentry**: https://sentry.io (for error tracking)

## SSL/TLS Certificates

Most platforms provide free SSL:
- Vercel: Automatic
- Railway: Automatic for custom domains
- Render: Automatic
- Google Cloud Run: Automatic
- Azure: Can use Let's Encrypt

## Environment Variables

Production checklist:

```
NODE_ENV=production
PORT=3000 (or platform-specified)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Performance Optimization

### CDN Setup

Use Cloudflare for caching:

1. Add your domain to Cloudflare
2. Set up caching rules for `/api/*` endpoints
3. Enable Gzip compression
4. Use HTTP/2 Push

### Response Caching

Add cache headers in `src/index.ts`:

```typescript
app.get("/api/v1/surahs", (c) => {
  c.header("Cache-Control", "public, max-age=3600");
  // ...
});
```

### Database Optimization

For production with large datasets:

```typescript
// Consider using:
// - PostgreSQL with node-postgres
// - MongoDB with mongoose
// - Redis for distributed caching
```

## Health Checks

Verify deployment:

```bash
# Check health endpoint
curl https://your-api.com/health

# Check API endpoint
curl https://your-api.com/api/v1/surahs | head

# Check rate limiting
curl -i https://your-api.com/api/v1/surahs
```

## Rollback Strategy

### Vercel
```bash
vercel rollback
```

### Railway
- Use deployment history in dashboard

### Render
- Use automatic rollback or manual deployment selection

## Cost Estimation

| Platform | Free Tier | Estimated Cost (100k req/mo) |
|----------|-----------|-------------------------------|
| Vercel   | Yes       | Free to $20/mo                |
| Railway  | Yes       | $5-10/mo                      |
| Render   | Yes       | $7/mo                         |
| Google Cloud Run | Yes | Pay-as-you-go (~$1-5) |
| AWS | Yes | $1-10/mo                  |
| Azure | Yes | $7-15/mo                  |

## Troubleshooting

### Application won't start
```bash
npm run build
npm start
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Out of memory
- Increase memory allocation
- Implement pagination for large results
- Add caching layer

### Slow response times
- Enable CORS caching
- Use CDN
- Optimize database queries
- Add Redis caching

## Support

For platform-specific issues:
- Vercel: https://vercel.com/support
- Railway: https://railway.app/help
- Render: https://render.com/docs
- GCP: https://cloud.google.com/support
- Azure: https://azure.microsoft.com/en-us/support
