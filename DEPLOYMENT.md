# Deploying to Vercel

This guide explains how to deploy the Quran application to Vercel.

## Deployment Architecture

There are two recommended approaches:

### Option A: Frontend on Vercel + Backend on Separate Service (Recommended)

- **Frontend**: Deploy Next.js app to Vercel
- **Backend**: Deploy Node.js/Hono API to Railway, Render, or another service
- **Communication**: Frontend connects to backend via environment variable

### Option B: Frontend Only on Vercel + Backend Elsewhere

- Deploy the frontend to Vercel
- Keep backend running on your own server or hosting service
- Update API URL in `.env.production`

## Prerequisites

1. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Vercel CLI** (Optional): Install globally with `npm install -g vercel`

## Step 1: Prepare Repository

Make sure your code is committed to Git:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## Step 2: Configure Frontend for Production

### Update Production Environment Variables

**File**: `frontend/.env.production`

```bash
# If backend is on the same Vercel domain:
NEXT_PUBLIC_API_URL=/api

# If backend is on a separate service:
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## Deployment Steps

### Deploy Frontend to Vercel

#### Method 1: Via Vercel Web UI (Recommended)

1. **Visit Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Find and click on this repository

3. **Configure Project**
   - **Framework Preset**: Select "Next.js"
   - **Root Directory**: Leave default (should auto-detect `frontend`)
   - **Build Command**: `npm run build --prefix frontend` (if needed)
   - **Output Directory**: Leave empty (auto-detected)
   - **Install Command**: `npm install --prefix frontend` (if needed)

4. **Environment Variables**
   - `NEXT_PUBLIC_API_URL` → Your backend API URL or `/api`

5. **Deploy**
   - Click "Deploy" button
   - Wait for deployment to complete

#### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow the prompts to link/create project
```

## Backend Deployment (Separate Service)

If deploying backend to a separate service:

### Deploy to Railway

1. **Connect Repository**
   - Visit https://railway.app
   - Click "Deploy from GitHub"
   - Select repository

2. **Configure Build**
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables**
   - `PORT`: 3000 (or any available port)

4. **Deploy**
   - Railway will auto-deploy

### Deploy to Render

1. **Create Web Service**
   - Visit https://render.com
   - Create new "Web Service"
   - Connect Git repository

2. **Configure**
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Deploy**
   - Render will auto-deploy on git push

## After Deployment

### Verify Frontend

1. Visit your Vercel domain (e.g., `https://quran-app.vercel.app`)
2. You should see the Quran app with surah list
3. Test search functionality
4. Click on a surah to view details

### Verify Backend (if on same domain)

1. Visit `https://your-domain.com/api`
2. Should return API status

### Update API URL (if needed)

If your backend URL changes:

1. Update `frontend/.env.production`
2. Trigger a redeployment by pushing to Git
3. Or manually trigger redeployment in Vercel dashboard

## Troubleshooting

### Frontend shows 404 on route changes

**Solution**: Next.js routing issue. Check:

- `frontend/next.config.mjs` is correct
- `frontend/tsconfig.json` has proper paths
- All pages exist in `frontend/app/` directory

### Backend API returns 404

**Solution**: If backend is on separate domain:

- Verify backend service is running
- Check CORS configuration
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check browser console for CORS errors

### Data appears to be loading slowly

**Solution**: This is normal on first load. Vercel serverless functions have cold starts.

- Data is cached for better performance
- Subsequent requests will be faster

### Environment variables not working

**Solution**:

- Public variables in Next.js must start with `NEXT_PUBLIC_`
- Redeploy after updating environment variables
- Check Vercel dashboard → Project Settings → Environment Variables

## Performance Optimization

The app includes built-in optimizations:

- **Caching**: 5-minute API response caching
- **Rate Limiting**: 1000 requests per minute
- **Compression**: Enabled by default
- **Static Generation**: Surah pages are pre-rendered

## Custom Domain

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel auto-issues SSL certificate

## Monitoring & Logs

### View Deployment Logs

1. Go to Vercel Dashboard → Project
2. Click "Deployments" tab
3. Select a deployment to view build/runtime logs

### Monitor Performance

1. Go to "Analytics" tab
2. View page performance metrics
3. Check for errors in "Function Logs"

## Rollback to Previous Deployment

If something goes wrong:

1. Go to Vercel Dashboard → Deployments
2. Find the previous stable deployment
3. Click "..." menu → "Redeploy"
4. Select specific deployment to promote to production

## Common Issues & Solutions

| Issue                         | Solution                                                  |
| ----------------------------- | --------------------------------------------------------- |
| Build fails                   | Check build command, verify dependencies installed        |
| API not responding            | Verify backend is deployed and running, check CORS config |
| Static assets 404             | Check `public/` folder exists in frontend                 |
| Slow first load               | Normal for serverless - first request triggers cold start |
| Environment variables not set | Verify `NEXT_PUBLIC_` prefix, redeploy after changes      |

## Next Steps

1. **Set up Custom Domain**: Point your domain to Vercel
2. **Enable Analytics**: Monitor traffic and performance
3. **Configure Alerts**: Get notified of failed deployments
4. **Set up CI/CD**: Automatic deployments on git push
5. **Monitor**: Check logs and performance regularly

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Issues**: Check GitHub issues or documentation

---

**Questions?** Review the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) or check the main README.md for additional

- Check browser console for CORS errors

### Data appears to be loading slowly

**Solution**: This is normal on first load. Vercel serverless functions have cold starts.

- Data is cached for better performance
- Subsequent requests will be faster

### Environment variables not working

**Solution**:

- Public variables in Next.js must start with `NEXT_PUBLIC_`
- Redeploy after updating environment variables
- Check Vercel dashboard → Project Settings → Environment Variables

## Performance Optimization

The app includes built-in optimizations:

- **Caching**: 5-minute API response caching
- **Rate Limiting**: 1000 requests per minute
- **Compression**: Enabled by default
- **Static Generation**: Surah pages are pre-rendered

## Custom Domain

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel auto-issues SSL certificate

## Monitoring & Logs

### View Deployment Logs

1. Go to Vercel Dashboard → Project
2. Click "Deployments" tab
3. Select a deployment to view build/runtime logs

### Monitor Performance

1. Go to "Analytics" tab
2. View page performance metrics
3. Check for errors in "Function Logs"

## Rollback to Previous Deployment

If something goes wrong:

1. Go to Vercel Dashboard → Deployments
2. Find the previous stable deployment
3. Click "..." menu → "Redeploy"
4. Select specific deployment to promote to production

## Common Issues & Solutions

| Issue                         | Solution                                                  |
| ----------------------------- | --------------------------------------------------------- |
| Build fails                   | Check build command, verify dependencies installed        |
| API not responding            | Verify backend is deployed and running, check CORS config |
| Static assets 404             | Check `public/` folder exists in frontend                 |
| Slow first load               | Normal for serverless - first request triggers cold start |
| Environment variables not set | Verify `NEXT_PUBLIC_` prefix, redeploy after changes      |

## Next Steps

1. **Set up Custom Domain**: Point your domain to Vercel
2. **Enable Analytics**: Monitor traffic and performance
3. **Configure Alerts**: Get notified of failed deployments
4. **Set up CI/CD**: Automatic deployments on git push
5. **Monitor**: Check logs and performance regularly

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Issues**: Check GitHub issues or documentation

---

**Questions?** Review the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) or check the main README.md for additional information.
