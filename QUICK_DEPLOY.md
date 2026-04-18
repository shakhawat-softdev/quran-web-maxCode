# Quick Deployment Guide

## 🚀 Deploy Frontend to Vercel in 3 Steps

### Step 1: Push Code to Git

```bash
cd d:\shakhawat\quran-web-maxCode
git add .
git commit -m "Deploy to Vercel"
git push
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/new
2. Select your GitHub/GitLab repository
3. Click "Import" and let Vercel auto-detect the configuration

### Step 3: Deploy Backend (Choose One Option)

#### Option A: Backend on Railway (Easiest)

1. Go to https://railway.app
2. Click "Deploy from GitHub"
3. Select the repository
4. Set Root Directory to `backend`
5. Railway auto-detects build & start commands

#### Option B: Backend on Render

1. Go to https://render.com
2. Create New → Web Service
3. Connect repository
4. Set Root Directory to `backend`
5. Deploy

#### Option C: Keep Backend Local

1. Frontend will be at `https://your-domain.vercel.app`
2. Update `frontend/.env.production`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
3. Keep backend running locally with: `cd backend && npm run dev`

---

## 📋 What's Configured

✅ **Frontend**

- Next.js 16.2.4 with TypeScript
- Environment file: `frontend/.env.production`
- API URL: `/api` (relative path for same domain)

✅ **Backend**

- Hono API with TypeScript
- Build script copies data files
- Production ready

✅ **Monorepo**

- Root `package.json` with workspace scripts
- `vercel.json` for frontend deployment
- `.env.production` for production env vars

---

## 🔗 Deployment Links

After deployment, you'll have:

| Component         | URL Example                          |
| ----------------- | ------------------------------------ |
| Frontend          | `https://quran-app.vercel.app`       |
| Backend (Railway) | `https://quran-backend.railway.app`  |
| Backend (Render)  | `https://quran-backend.onrender.com` |

---

## ✅ Deployment Checklist

- [ ] Code committed to GitHub
- [ ] `frontend/.env.production` has correct API URL
- [ ] Connected Vercel to GitHub repository
- [ ] Vercel deployment completed successfully
- [ ] Frontend loads at Vercel URL
- [ ] Backend deployed (Railway/Render or local)
- [ ] Update frontend API URL if needed
- [ ] Test frontend → backend communication

---

## 🆘 Quick Troubleshooting

**Frontend won't load?**

- Check Vercel build logs
- Verify `frontend/package.json` exists
- Ensure Next.js framework auto-detected

**Backend API unreachable?**

- Verify backend service is running
- Check API URL in `frontend/.env.production`
- Verify CORS is enabled in backend

**Need to change API URL?**

- Edit `frontend/.env.production`
- Push to git
- Vercel redeploys automatically

---

## 📚 Full Documentation

- **Detailed Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Backend Setup**: Check [backend/README.md](./backend/README.md) if exists
- **Project README**: [README.md](./README.md)

---

**Ready?** Go to https://vercel.com/new and start deploying! 🎉
