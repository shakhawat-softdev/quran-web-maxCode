# Quick Deployment Guide - Monorepo to Vercel

## 🎯 Your Setup

✅ **Single Repository** with Frontend + Backend  
✅ **Vercel Configuration** (`vercel.json`) to deploy both  
✅ **Same Domain** - Frontend at root, Backend API at `/api`

---

## 🚀 Deploy to Vercel in 3 Steps

### Step 1: Push to GitHub

```bash
cd d:\shakhawat\quran-web-maxCode
git add .
git commit -m "Deploy to Vercel - monorepo"
git push
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click "Continue with GitHub"
3. Find and select your repository
4. **Click "Deploy"** (don't change anything - `vercel.json` handles it)

### Step 3: Wait for Deployment

Vercel automatically:

- Builds frontend (Next.js) from `/frontend`
- Builds backend (Node.js serverless) from `/backend`
- Routes `/api/*` to backend
- Routes everything else to frontend

Deployment takes **2-3 minutes**.

---

## ✅ After Deployment

Your app will be available at:

```
https://your-project-name.vercel.app
```

**Frontend**: `https://your-project-name.vercel.app`  
**Backend API**: `https://your-project-name.vercel.app/api`

---

## 🧪 Test Your Deployment

### Test Frontend

```
https://your-project-name.vercel.app
```

You should see the Quran app with surah list.

### Test Backend API

```bash
# Get all surahs
curl https://your-project-name.vercel.app/api/v1/surahs

# Search
curl "https://your-project-name.vercel.app/api/v1/search?q=moon"

# Get surah details
curl https://your-project-name.vercel.app/api/v1/surah/1
```

---

## 📊 How It Works

Your `vercel.json` configuration:

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

This tells Vercel to:

1. Build backend as Node.js serverless functions
2. Build frontend as Next.js
3. Route API requests to backend
4. Route everything else to frontend

---

## 🐛 Troubleshooting

### API returns 404

- Backend build might have failed
- Go to Vercel dashboard → Deployments → see build logs
- Make sure `backend/src/data/quran-data.json` exists

### Frontend shows blank

- Check browser console for errors
- Verify `frontend/.env.production` has `NEXT_PUBLIC_API_URL=/api`

### Slow first load

- Normal - Vercel serverless has cold starts
- Second requests are faster

### To Check Build Status

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to "Deployments"
4. Click latest deployment
5. Check "Build Logs"

---

## 📋 What's Already Configured

✅ `vercel.json` - Routes both frontend and backend  
✅ `frontend/.env.production` - API URL set to `/api`  
✅ `backend/package.json` - Build copies data files  
✅ `backend/src/index.ts` - Exports app for Vercel

**No changes needed - just push and deploy!**

---

## 🎉 Done!

Your monorepo is deployed. Frontend and backend work on the same Vercel domain.

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for full documentation.
