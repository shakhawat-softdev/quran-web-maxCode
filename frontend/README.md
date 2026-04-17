# Quran App - Next.js 14 App Router

A modern, elegant Quran web application built with Next.js 14 App Router, featuring SSG, beautiful Islamic-inspired design, and full responsiveness.

## 🚀 Features

- **Next.js 14 App Router** - Modern file-based routing
- **Static Site Generation (SSG)** - All surah pages pre-rendered at build time
- **Server & Client Components** - Optimized performance
- **Responsive Design** - Mobile-first approach
- **Settings System** - Customizable Arabic fonts and font sizes with localStorage persistence
- **Search Functionality** - Search through ayahs in Arabic and English
- **SEO Optimized** - Dynamic metadata for all pages
- **Smooth Animations** - Motion (Framer Motion) for elegant transitions

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with SettingsProvider
│   ├── page.tsx            # Home page (Surah list - SSG)
│   ├── not-found.tsx       # 404 page
│   ├── search/
│   │   └── page.tsx        # Search page (client-side search)
│   └── surah/
│       └── [id]/
│           ├── page.tsx            # Surah detail (SSG with generateStaticParams)
│           └── SurahDetailClient.tsx  # Client component for surah details
├── components/
│   ├── SurahCard.tsx       # Surah card component
│   ├── AyahItem.tsx        # Ayah display component
│   ├── SearchBar.tsx       # Search input component
│   └── SettingsSidebar.tsx # Settings drawer
├── context/
│   └── SettingsContext.tsx # Settings state management
├── lib/
│   ├── api.ts              # Centralized API functions
│   └── quran-data.ts       # Quran data (114 surahs)
├── src/
│   ├── app/components/ui/  # Radix UI components
│   └── styles/             # Global styles
│       ├── fonts.css       # Font imports (Amiri, Scheherazade, Inter, Poppins)
│       ├── index.css       # Main stylesheet
│       ├── tailwind.css    # Tailwind imports
│       └── theme.css       # Custom theme tokens
└── next.config.mjs         # Next.js configuration
```

## 🎨 Design System

- **Primary Color**: Emerald green (#065f46)
- **Secondary Color**: Light cream (#fefce8)
- **Accent Color**: Gold (#d4af37)
- **Arabic Fonts**: Amiri, Scheherazade New
- **English Fonts**: Inter, Poppins
- **Border Radius**: 12-16px
- **Spacing**: 8px grid system

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
# or
pnpm build

# Start production server
npm start
# or
pnpm start
```

## 🌐 Routes

- `/` - Surah List (SSG)
- `/surah/[id]` - Surah Details (SSG with 114 static params)
- `/search` - Search Ayahs (Client-side)

## 🔍 Data Fetching

All data fetching is centralized in `/lib/api.ts`:

- `getSurahs()` - Get all surahs
- `getSurahById(id)` - Get single surah
- `getAyahsBySurah(surahNumber)` - Get ayahs for a surah
- `searchAyahs(query)` - Search through ayahs
- `getAllSurahNumbers()` - Get all surah numbers for SSG

## ⚙️ Settings

User preferences are stored in localStorage:
- Arabic Font (Amiri / Scheherazade New)
- Arabic Font Size (20-48px)
- Translation Font Size (12-24px)

## 🎯 Performance Optimizations

- **SSG for all surah pages** - Lightning-fast page loads
- **React.memo** - Prevent unnecessary re-renders
- **useMemo** - Optimize search filtering
- **useCallback** - Stable function references
- **Server Components** - Where possible for reduced client JS
- **Image Optimization** - Next.js automatic image optimization

## 📱 Responsive Design

- **Mobile**: 1 column grid
- **Tablet**: 2 column grid
- **Desktop**: 3-4 column grid

## 🔐 SEO

Each page includes:
- Dynamic `<title>` tags
- Meta descriptions
- Keywords
- Open Graph tags (via Next.js metadata API)

## 🚦 Migration from React (Vite) to Next.js

### Key Changes:

1. **Routing**: React Router → Next.js App Router (file-based)
2. **Data Fetching**: Client-side → SSG with `generateStaticParams()`
3. **Components**: Added `'use client'` directive for client components
4. **Links**: `<Link>` from react-router → `<Link>` from next/link
5. **Styles**: Maintained Tailwind CSS v4 setup
6. **Context**: Added proper client-side context with mounted state

### Components Classification:

**Server Components** (default):
- `/app/surah/[id]/page.tsx` (page wrapper)

**Client Components** (`'use client'`):
- All interactive components (SurahCard, SearchBar, SettingsSidebar)
- Pages with state/hooks (Home, Search, SurahDetailClient)
- Context providers

## 📄 License

This is a demonstration project for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js 14 and Tailwind CSS
