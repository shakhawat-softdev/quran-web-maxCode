# Migration Guide: React (Vite) → Next.js 14 App Router

## Overview

This document outlines the complete migration from a React + Vite application to Next.js 14 with App Router.

## ✅ Completed Migration Tasks

### 1. Project Setup ✓

- [x] Installed Next.js 14
- [x] Created `next.config.mjs`
- [x] Created `tsconfig.json` for Next.js
- [x] Updated `package.json` scripts (dev, build, start)
- [x] Created `.gitignore` for Next.js

### 2. Routing Structure ✓

**Before (React Router):**
```tsx
// src/app/routes.tsx
createBrowserRouter([
  { path: "/", Component: SurahListPage },
  { path: "/surah/:surahNumber", Component: AyatPage },
]);
```

**After (Next.js App Router):**
```
app/
  ├── page.tsx                    # / route
  ├── surah/[id]/page.tsx        # /surah/:id route
  └── search/page.tsx            # /search route
```

### 3. Data Layer Migration ✓

**Created `/lib/api.ts`** with centralized API functions:
- `getSurahs()` - Fetch all surahs (used for SSG)
- `getSurahById(id)` - Fetch single surah
- `getAyahsBySurah(surahNumber)` - Fetch ayahs
- `searchAyahs(query)` - Search functionality
- `getAllSurahNumbers()` - For `generateStaticParams()`

**Moved data** from `src/app/data/` to `/lib/`:
- `quran-data.ts` → `/lib/quran-data.ts`

### 4. Component Migration ✓

All components moved to `/components/` directory:

| Old Path | New Path | Type |
|----------|----------|------|
| `src/app/components/SurahCard.tsx` | `/components/SurahCard.tsx` | Client |
| `src/app/components/AyahItem.tsx` | `/components/AyahItem.tsx` | Client |
| `src/app/components/SearchBar.tsx` | `/components/SearchBar.tsx` | Client |
| `src/app/components/SettingsSidebar.tsx` | `/components/SettingsSidebar.tsx` | Client |

**Key Changes:**
- Added `'use client'` directive to all components using hooks/state/animations
- Changed `import { Link } from 'react-router'` → `import Link from 'next/link'`
- Changed `<Link to="/path">` → `<Link href="/path">`

### 5. Context Migration ✓

**Before:**
```tsx
// src/app/context/SettingsContext.tsx
// Direct localStorage access
```

**After:**
```tsx
// context/SettingsContext.tsx
'use client';

// Added mounted state to prevent hydration errors
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
  // Load from localStorage
}, []);
```

### 6. Page Migration ✓

#### Home Page (Surah List)
- **Before**: `src/app/pages/SurahListPage.tsx` (React Router)
- **After**: `app/page.tsx` (Next.js, Client Component)
- **Features**:
  - Client-side filtering with `useMemo`
  - Real-time search
  - Settings sidebar integration

#### Surah Detail Page
- **Before**: `src/app/pages/AyatPage.tsx` (React Router with `useParams`)
- **After**: 
  - `app/surah/[id]/page.tsx` (Server Component wrapper)
  - `app/surah/[id]/SurahDetailClient.tsx` (Client Component)
- **Features**:
  - SSG with `generateStaticParams()` for all 114 surahs
  - Dynamic metadata with `generateMetadata()`
  - Server-side data fetching

#### Search Page
- **New**: `app/search/page.tsx`
- **Features**:
  - Client-side search through all ayahs
  - Real-time filtering with `useMemo`
  - Optimized performance

### 7. Static Site Generation (SSG) ✓

Implemented SSG for surah pages:

```tsx
// app/surah/[id]/page.tsx
export async function generateStaticParams() {
  const surahNumbers = await getAllSurahNumbers();
  return surahNumbers.map((num) => ({
    id: num.toString(),
  }));
}
```

This generates **114 static pages** at build time.

### 8. SEO Optimization ✓

#### Root Layout
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Quran App - Read & Reflect',
  description: '...',
  keywords: ['Quran', 'Islam', ...],
};
```

#### Dynamic Pages
```tsx
// app/surah/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const surah = await getSurahById(Number(params.id));
  return {
    title: `${surah.englishName} (${surah.name}) - Quran App`,
    description: `Read Surah ${surah.englishName}...`,
  };
}
```

### 9. Performance Optimizations ✓

- [x] Used `useMemo` for expensive filtering operations
- [x] Used `useCallback` for stable function references
- [x] Server Components where possible (page wrappers)
- [x] Client Components only when needed (interactivity)
- [x] SSG for all surah pages (build time generation)

### 10. Styling Migration ✓

- [x] Maintained existing Tailwind CSS v4 setup
- [x] Kept all custom theme tokens in `/src/styles/theme.css`
- [x] Font imports in `/src/styles/fonts.css`
- [x] No changes to UI components in `/src/app/components/ui/`

## 📊 Migration Comparison

| Feature | React (Vite) | Next.js 14 |
|---------|-------------|------------|
| Routing | React Router (client-side) | App Router (file-based) |
| Data Fetching | Client-side only | SSG + Client-side |
| SEO | Limited | Full metadata support |
| Performance | Client-side rendering | SSG + hydration |
| Build Output | SPA bundle | Static HTML + JS chunks |
| Initial Load | Slower (JS bundle) | Faster (pre-rendered HTML) |

## 🚀 Running the App

### Development
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm run start
```

## 📝 Key Differences

### Links
```tsx
// Before (React Router)
<Link to="/surah/1">

// After (Next.js)
<Link href="/surah/1">
```

### Navigation with Params
```tsx
// Before (React Router)
const { surahNumber } = useParams();

// After (Next.js)
// In Server Component
async function Page({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
}

// In Client Component
// Pass data as props from parent Server Component
```

### Data Fetching
```tsx
// Before (React Router)
const [data, setData] = useState();
useEffect(() => {
  fetchData().then(setData);
}, []);

// After (Next.js Server Component)
async function Page() {
  const data = await fetchData(); // Direct async/await
  return <Component data={data} />;
}

// After (Next.js Client Component)
// Same as before, or receive as props from Server Component
```

## 🎯 Benefits Achieved

1. **Better Performance**: SSG provides instant page loads for all 114 surahs
2. **SEO Friendly**: Pre-rendered HTML with proper metadata
3. **Type Safety**: Full TypeScript integration with Next.js
4. **Developer Experience**: File-based routing, less boilerplate
5. **Production Ready**: Optimized builds with automatic code splitting

## 🔄 Backward Compatibility

The old React app files are preserved in `/src/app/` but deprecated. The new Next.js app uses the `/app` directory (App Router).

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

Migration completed successfully! All features maintained with improved performance and SEO.
