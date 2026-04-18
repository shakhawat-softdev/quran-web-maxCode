# Monorepo Deployment - Explanation

## Your Repository Structure

```
quran-web-maxCode/
├── backend/              ← Node.js/Hono API
│   ├── src/
│   │   ├── index.ts     ← Main app (exported for Vercel)
│   │   ├── data/
│   │   │   └── quran-data.json
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   ├── dist/            ← Compiled output (generated during build)
│   ├── package.json     ← Has build script
│   └── tsconfig.json
│
├── frontend/            ← Next.js App
│   ├── app/
│   │   ├── page.tsx
│   │   ├── search/
│   │   └── surah/
│   ├── components/
│   ├── .env.production  ← API URL = /api
│   ├── package.json
│   └── tsconfig.json
│
├── api/                 ← Vercel serverless entry point
│   └── index.ts        ← Optional fallback handler
│
├── vercel.json         ← Deployment config (builds both apps)
├── package.json        ← Root monorepo config
└── README.md
```

---

## How Vercel Deploys Your Monorepo

### 1. Detects Builds

When you push to GitHub and Vercel imports the repo:

```
vercel.json tells Vercel:
├── Build 1: backend/package.json as Node.js function
└── Build 2: frontend/package.json as Next.js app
```

### 2. Build Process

**Backend Build (Node.js)**

```bash
# Vercel runs:
cd backend
npm install
npm run build   # TypeScript → JavaScript, copies data files
# Output: backend/dist/index.js (the compiled API handler)
```

**Frontend Build (Next.js)**

```bash
# Vercel runs:
cd frontend
npm install
npm run build   # Builds Next.js static site
# Output: Optimized static files & serverless functions
```

### 3. Routing

After build, `vercel.json` routes requests:

```
Request to: /api/v1/surahs
  ↓
Matches: /api/(.*)
  ↓
Routes to: backend/dist/index.js
  ↓
Backend processes and returns JSON
```

```
Request to: /surah/1
  ↓
Matches: /(.*)
  ↓
Routes to: frontend/$1
  ↓
Next.js serves the page
```

---

## Environment Variables

### Frontend Production (`frontend/.env.production`)

```
NEXT_PUBLIC_API_URL=/api
```

This tells Next.js to call `/api` instead of `http://localhost:3000`.  
Since both are on the same Vercel domain, this works perfectly.

### Backend Configuration

No additional `.env` needed for Vercel deployment (uses defaults).

---

## Deployment Flow

```
1. You push to GitHub
   ↓
2. Vercel webhook triggered
   ↓
3. Vercel clones your repo
   ↓
4. Reads vercel.json
   ↓
5. Builds backend (Node.js) → backend/dist/index.js
   ↓
6. Builds frontend (Next.js) → Static files + functions
   ↓
7. Deploys both to same domain
   ↓
8. Routes configured:
   - /api/* → backend
   - /* → frontend
   ↓
9. Your app is live! 🎉
```

---

## URL Structure

After deployment to Vercel:

```
https://quran-app.vercel.app                    ← Frontend
https://quran-app.vercel.app/surah/1            ← Frontend page
https://quran-app.vercel.app/search             ← Frontend page
https://quran-app.vercel.app/api                ← Backend status
https://quran-app.vercel.app/api/v1/surahs      ← Backend API
https://quran-app.vercel.app/api/v1/surah/1     ← Backend API
https://quran-app.vercel.app/api/v1/search      ← Backend API
```

Everything is on **the same domain** (`quran-app.vercel.app`).

---

## Key Configuration Files

### `vercel.json` (Root)

```json
{
  "builds": [
    { "src": "backend/package.json", "use": "@vercel/node@latest" },
    { "src": "frontend/package.json", "use": "@vercel/next@latest" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/backend/dist/index.js" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ]
}
```

**What it does**: Tells Vercel to build both apps and route requests.

### `backend/src/index.ts`

```typescript
export const app = new Hono();
// ... routes ...
export default app; // ← Exported for Vercel
```

**What it does**: Exports the app so Vercel can use it as a serverless function.

### `backend/package.json`

```json
{
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc && copy src\\data\\*.json dist\\data\\"
  }
}
```

**What it does**: Compiles TypeScript and copies data files.

### `frontend/.env.production`

```
NEXT_PUBLIC_API_URL=/api
```

**What it does**: Tells frontend to call `/api` (which Vercel routes to backend).

---

## Why This Works

1. **Same Domain**: Frontend and backend share the same Vercel domain
2. **Relative URLs**: Frontend uses `/api` (no CORS issues)
3. **Automatic Routing**: Vercel's `vercel.json` handles all routing
4. **One Deployment**: Single `git push` deploys both

---

## Comparison: This Approach vs. Separate Deployments

| Feature    | Monorepo (Your Setup) | Separate Deployments |
| ---------- | --------------------- | -------------------- |
| Deployment | 1 click               | Multiple clicks      |
| CORS       | Not needed            | Required             |
| API URL    | Relative `/api`       | Full URL needed      |
| Syncing    | Automatic             | Manual               |
| Scaling    | Together              | Independent          |
| Cost       | Lower                 | Higher               |

---

## Common Questions

**Q: Can I deploy them separately?**  
A: Yes, but monorepo is simpler. Backend and frontend are tightly coupled (same domain).

**Q: What if backend gets heavy traffic?**  
A: Vercel scales backend serverless functions automatically.

**Q: Can I use a custom domain?**  
A: Yes! Add domain in Vercel dashboard → both frontend and backend use it.

**Q: How do I update just the backend?**  
A: Push to GitHub → Vercel redeploys only the changed parts.

---

## Troubleshooting

**Backend not deploying?**

- Check `vercel.json` routing
- Ensure `backend/package.json` exists
- Check build logs in Vercel dashboard

**API calls failing?**

- Verify `frontend/.env.production` has `NEXT_PUBLIC_API_URL=/api`
- Check browser network tab
- Verify backend built successfully

**Slow performance?**

- Normal on first request (serverless cold start)
- Cache is enabled (5-minute TTL)
- Subsequent requests are faster

---

## Next Steps

1. **Push to GitHub**: `git push`
2. **Go to Vercel**: https://vercel.com/new
3. **Import repository**: Select your repo
4. **Deploy**: Click "Deploy"
5. **Test**: Visit your Vercel domain

That's it! Your monorepo is deployed. 🚀
