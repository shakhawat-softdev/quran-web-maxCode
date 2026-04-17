# Quran App - Next.js Project Structure

## 📁 Complete Directory Tree

```
quran-app-nextjs/
├── app/                                    # Next.js App Router (NEW)
│   ├── layout.tsx                         # Root layout with providers
│   ├── page.tsx                           # Home page (/) - Surah list
│   ├── not-found.tsx                      # 404 error page
│   ├── search/
│   │   └── page.tsx                       # Search page (/search)
│   └── surah/
│       └── [id]/
│           ├── page.tsx                   # Surah detail (Server Component)
│           └── SurahDetailClient.tsx      # Surah detail (Client Component)
│
├── components/                             # Shared components (NEW)
│   ├── SurahCard.tsx                      # Surah card with hover effects
│   ├── AyahItem.tsx                       # Ayah display with settings
│   ├── SearchBar.tsx                      # Search input component
│   └── SettingsSidebar.tsx                # Settings drawer with sliders
│
├── context/                                # React Context (NEW)
│   └── SettingsContext.tsx                # Settings state management
│
├── lib/                                    # Utilities & Data (NEW)
│   ├── api.ts                             # Centralized API functions
│   └── quran-data.ts                      # All 114 surahs + sample ayahs
│
├── src/                                    # Legacy React app (DEPRECATED)
│   ├── app/
│   │   ├── App.tsx                        # Old entry point (deprecated)
│   │   ├── routes.tsx                     # React Router config (deprecated)
│   │   ├── components/
│   │   │   ├── figma/                     # Figma-specific components
│   │   │   └── ui/                        # Radix UI components (STILL USED)
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── select.tsx
│   │   │       ├── slider.tsx
│   │   │       └── ... (other UI components)
│   │   ├── context/
│   │   │   └── SettingsContext.tsx        # Old context (deprecated)
│   │   ├── data/
│   │   │   └── quran-data.ts              # Old data file (deprecated)
│   │   └── pages/
│   │       ├── SurahListPage.tsx          # Old surah list (deprecated)
│   │       └── AyatPage.tsx               # Old ayat page (deprecated)
│   └── styles/                             # Global styles (STILL USED)
│       ├── fonts.css                      # Font imports (Amiri, Scheherazade, Inter, Poppins)
│       ├── index.css                      # Main stylesheet entry
│       ├── tailwind.css                   # Tailwind imports
│       └── theme.css                      # Custom theme tokens & CSS variables
│
├── public/                                 # Static assets
│   └── (static files)
│
├── node_modules/                           # Dependencies
│
├── .next/                                  # Next.js build output
│
├── .gitignore                             # Git ignore rules
├── next.config.mjs                        # Next.js configuration
├── tsconfig.json                          # TypeScript configuration
├── tailwind.config.ts                     # Tailwind CSS configuration
├── postcss.config.mjs                     # PostCSS configuration
├── package.json                           # Package dependencies & scripts
├── pnpm-lock.yaml                         # Lock file
├── README.md                              # Project documentation
├── MIGRATION_GUIDE.md                     # Migration documentation
└── PROJECT_STRUCTURE.md                   # This file
```

## 📂 Detailed File Descriptions

### `/app` - Next.js App Router

#### `app/layout.tsx`
- **Type**: Server Component
- **Purpose**: Root layout for all pages
- **Responsibilities**:
  - HTML structure
  - Global providers (SettingsProvider)
  - Global metadata
  - Font loading

#### `app/page.tsx`
- **Type**: Client Component (`'use client'`)
- **Route**: `/`
- **Purpose**: Home page with all 114 surahs
- **Features**:
  - Search functionality
  - Grid layout (responsive)
  - Settings sidebar
  - Real-time filtering

#### `app/not-found.tsx`
- **Type**: Server Component
- **Route**: `/404` (automatic)
- **Purpose**: Custom 404 error page
- **Features**:
  - Friendly error message
  - Link back to home

#### `app/search/page.tsx`
- **Type**: Client Component
- **Route**: `/search`
- **Purpose**: Search through all ayahs
- **Features**:
  - Real-time search
  - Search in Arabic & English
  - Result highlighting

#### `app/surah/[id]/page.tsx`
- **Type**: Server Component
- **Route**: `/surah/1` to `/surah/114`
- **Purpose**: Wrapper for surah detail page
- **Responsibilities**:
  - Static params generation (SSG)
  - SEO metadata generation
  - Data fetching
  - Pass props to client component

#### `app/surah/[id]/SurahDetailClient.tsx`
- **Type**: Client Component
- **Purpose**: Display surah details with interactivity
- **Features**:
  - Ayah list
  - Settings sidebar
  - Smooth animations
  - Navigation

### `/components` - Shared Components

All components in this directory are **Client Components** (`'use client'`) because they use:
- React hooks (useState, useEffect, useContext)
- Motion animations
- Event handlers

#### `SurahCard.tsx`
- **Props**: `{ surah: Surah }`
- **Features**:
  - Hover animations
  - Click to navigate
  - Displays: number, Arabic name, English name, ayah count, type

#### `AyahItem.tsx`
- **Props**: `{ ayah: Ayah }`
- **Features**:
  - Uses settings context
  - Displays Arabic text with custom font/size
  - Displays translation with custom size
  - Ayah number badge

#### `SearchBar.tsx`
- **Props**: `{ value, onChange, placeholder }`
- **Features**:
  - Search icon
  - Real-time input
  - Styled with Tailwind

#### `SettingsSidebar.tsx`
- **Props**: `{ isOpen, onClose }`
- **Features**:
  - Slide animation
  - Font selector (dropdown)
  - Font size sliders (2)
  - Auto-save indicator
  - Preview text

### `/context` - State Management

#### `SettingsContext.tsx`
- **Type**: Client Component
- **Purpose**: Global settings state
- **Provides**:
  - `arabicFont` (Amiri | Scheherazade New)
  - `setArabicFont`
  - `arabicFontSize` (20-48px)
  - `setArabicFontSize`
  - `translationFontSize` (12-24px)
  - `setTranslationFontSize`
- **Persistence**: localStorage (with mounted check)

### `/lib` - Utilities & Data

#### `api.ts`
- **Purpose**: Centralized data fetching
- **Functions**:
  - `getSurahs()` → All 114 surahs
  - `getSurahById(id)` → Single surah
  - `getAyahsBySurah(id)` → Ayahs for surah
  - `searchAyahs(query)` → Search results
  - `getAllSurahNumbers()` → [1...114] for SSG

#### `quran-data.ts`
- **Purpose**: Static data source
- **Exports**:
  - `Surah` interface
  - `Ayah` interface
  - `surahs` array (114 items)
  - `ayahsBySurah` object (sample data for surahs 1 & 112)

### `/src/styles` - Styling

#### `fonts.css`
- **Purpose**: Import web fonts
- **Fonts**:
  - Amiri (Arabic)
  - Scheherazade New (Arabic)
  - Inter (English)
  - Poppins (English)

#### `theme.css`
- **Purpose**: CSS custom properties & theme tokens
- **Contains**:
  - Light mode colors
  - Dark mode colors (if applicable)
  - Spacing variables
  - Border radius
  - Font weights
  - Color palette (primary, secondary, accent)

#### `tailwind.css`
- **Purpose**: Tailwind CSS imports
- **Contains**:
  ```css
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
  ```

#### `index.css`
- **Purpose**: Main stylesheet entry
- **Imports**:
  - fonts.css
  - tailwind.css
  - theme.css
- **Global styles**:
  - Body font-family

### `/src/app/components/ui` - UI Components

Radix UI components (pre-built, from shadcn/ui):
- `button.tsx` - Button variants
- `card.tsx` - Card component
- `input.tsx` - Input field
- `label.tsx` - Form label
- `select.tsx` - Dropdown select
- `slider.tsx` - Range slider
- `dialog.tsx` - Modal dialog
- ... (and many more)

These are **still used** by the new Next.js app.

## 🎯 Import Paths

With TypeScript path mapping (`@/*`), imports work like this:

```tsx
// Components
import { SurahCard } from '@/components/SurahCard';

// Context
import { useSettings } from '@/context/SettingsContext';

// Data & API
import { getSurahs } from '@/lib/api';
import { surahs } from '@/lib/quran-data';

// UI Components (from src/)
import { Button } from '@/src/app/components/ui/button';
import { Slider } from '@/src/app/components/ui/slider';

// Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
```

## 🗂️ File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Pages | `page.tsx` | `app/page.tsx` |
| Layouts | `layout.tsx` | `app/layout.tsx` |
| Components | `PascalCase.tsx` | `SurahCard.tsx` |
| Utilities | `kebab-case.ts` | `quran-data.ts` |
| Context | `PascalCaseContext.tsx` | `SettingsContext.tsx` |
| Config | `kebab-case.{ext}` | `next.config.mjs` |

## 📦 Package Categories

### Core
- `next` - Framework
- `react` - UI library
- `react-dom` - DOM renderer

### Styling
- `tailwindcss` - CSS framework
- `@tailwindcss/vite` - Vite plugin

### UI Components
- `@radix-ui/*` - Accessible components
- `lucide-react` - Icons

### Animations
- `motion` - Animation library

### Utilities
- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merger

## 🚀 Quick Reference

### Adding a New Page
1. Create `app/your-page/page.tsx`
2. Export default component
3. Add metadata if needed

### Adding a New Component
1. Create `components/YourComponent.tsx`
2. Add `'use client'` if it uses hooks/events
3. Export component

### Adding Data
1. Update `lib/quran-data.ts` (static data)
2. Update `lib/api.ts` (API functions)

---

This structure provides clear separation between:
- **Routing** (`/app`)
- **Components** (`/components`)
- **State** (`/context`)
- **Data** (`/lib`)
- **Styles** (`/src/styles`)
- **UI Kit** (`/src/app/components/ui`)
