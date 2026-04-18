# Vercel Deployment Checklist ✅

Use this checklist to ensure your project is ready for Vercel deployment.

## Pre-Deployment Checks

### Repository & Git

- [ ] Code is committed to GitHub (or GitLab/Bitbucket)
- [ ] `.gitignore` is properly configured
- [ ] No sensitive data (API keys, passwords) in code
- [ ] Main branch is up-to-date

### Backend Setup

- [ ] `backend/package.json` exists with all dependencies
- [ ] `backend/src/data/quran-data.json` exists with Quran data
- [ ] `backend/src/index.ts` (development server) is configured
- [ ] Build script copies data files: `"build": "tsc && copy src\\data\\*.json dist\\data\\"`

### Frontend Setup

- [ ] `frontend/package.json` exists with Next.js 16.2.4+
- [ ] `frontend/.env.production` has: `NEXT_PUBLIC_API_URL=/api`
- [ ] `frontend/next.config.mjs` is configured correctly
- [ ] All pages and components build without errors

### Root Configuration

- [ ] `vercel.json` is properly configured
- [ ] `package.json` (root) exists with workspace scripts
- [ ] `api/index.ts` handler exists for serverless functions
- [ ] `.gitignore` includes: `node_modules/`, `.next/`, `dist/`, etc.

## Deployment Steps

### Step 1: Push to Git

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect Vercel

- [ ] Login to [vercel.com](https://vercel.com)
- [ ] Click "Add New" → "Project"
- [ ] Import your repository
- [ ] Select Git provider and repository
- [ ] Vercel auto-detects: Framework (Next.js), Root Directory

### Step 3: Configure Build Settings

- [ ] Build Command: `npm run build`
- [ ] Output Directory: (leave empty - auto-detected)
- [ ] Install Command: `npm install`
- [ ] Check "Automatic deployments" is enabled

### Step 4: Environment Variables (Optional)

Add only if needed:

- [ ] `NEXT_PUBLIC_API_URL` (usually auto-configured as `/api`)
- [ ] Any backend environment variables (rarely needed)

### Step 5: Deploy

- [ ] Click "Deploy" button
- [ ] Monitor the deployment progress
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for any errors

## Post-Deployment Verification

### Frontend (http://your-domain.vercel.app)

- [ ] Home page loads without errors
- [ ] Surah list displays correctly
- [ ] Search functionality works
- [ ] Clicking on surahs shows details page

### Backend API (http://your-domain.vercel.app/api)

- [ ] `/api` returns API status
- [ ] `/api/v1/surahs` returns list of 114 surahs
- [ ] `/api/v1/surah/1` returns surah details with ayahs
- [ ] `/api/v1/search?q=mercy` returns search results

### Performance Check

- [ ] Pages load within 2-3 seconds
- [ ] API responses are fast
- [ ] No console errors in browser DevTools

## Troubleshooting

### Deployment Failed

1. Check Vercel build logs for errors
2. Verify all files are committed to Git
3. Ensure `package.json` files exist in both folders
4. Check TypeScript compilation errors

### Frontend Shows 404

1. Verify `frontend/package.json` exists
2. Check Next.js configuration
3. Ensure `.next` folder will be created during build

### Backend API Not Working

1. Verify `api/index.ts` exists at root level
2. Check data files are copied in build process
3. Review Vercel function logs
4. Ensure CORS is properly configured

### Data File Not Found

1. Verify `backend/src/data/quran-data.json` exists
2. Check build script includes `copy src\\data\\*.json dist\\data\\`
3. Review build logs to confirm copy command executed

## Quick Links

- 📊 [Vercel Dashboard](https://vercel.com/dashboard)
- 📚 [Vercel Documentation](https://vercel.com/docs)
- ▲ [Next.js Documentation](https://nextjs.org/docs)
- 🔥 [Hono Documentation](https://hono.dev/docs)

## After Successful Deployment

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Vercel will auto-issue SSL certificate

### Monitoring

1. Enable Vercel Web Analytics
2. Set up alerts for failed deployments
3. Monitor function duration and usage

### Updates & Maintenance

1. Push updates to main branch
2. Vercel auto-deploys changes
3. Previous deployments available as Preview URLs
4. Rollback to previous deployment if needed

---

**Need Help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions or review Vercel's official documentation.
