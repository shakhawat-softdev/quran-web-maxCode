'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Search as SearchIcon, BookMarked } from 'lucide-react';
import { surahs, ayahsBySurah } from '@/lib/quran-data';
import { SearchBar } from '@/components/SearchBar';
import { AyahItem } from '@/components/AyahItem';
import { SettingsSidebar } from '@/components/SettingsSidebar';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return [];
    }

    const lowerQuery = searchQuery.toLowerCase();
    const results: Array<{ ayah: any; surahName: string }> = [];

    Object.values(ayahsBySurah).forEach(surahAyahs => {
      surahAyahs.forEach(ayah => {
        if (
          ayah.text.toLowerCase().includes(lowerQuery) ||
          ayah.translation.toLowerCase().includes(lowerQuery)
        ) {
          const surah = surahs.find(s => s.number === ayah.surah);
          results.push({ 
            ayah, 
            surahName: surah ? `${surah.englishName} (${surah.name})` : ''
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <SettingsSidebar isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Link>
            <div>
              <h1 className="font-['Poppins'] font-semibold text-foreground">Search Ayahs</h1>
              <p className="text-sm text-muted-foreground">Find verses in the Quran</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ayahs by Arabic text or translation..."
          />
        </motion.div>

        {/* Results */}
        {searchQuery.trim().length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground font-['Inter']">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={`${result.ayah.surah}-${result.ayah.number}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="mb-2">
                      <Link 
                        href={`/surah/${result.ayah.surah}`}
                        className="text-sm text-primary hover:underline font-['Poppins']"
                      >
                        {result.surahName} - Ayah {result.ayah.number}
                      </Link>
                    </div>
                    <AyahItem ayah={result.ayah} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <SearchIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-['Poppins'] text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground">Try different search terms</p>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <SearchIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-['Poppins'] text-foreground mb-2">Start searching</h3>
            <p className="text-muted-foreground">Enter keywords to search through ayahs</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
