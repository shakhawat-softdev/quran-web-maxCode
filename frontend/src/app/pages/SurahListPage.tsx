import { useState } from "react";
import { motion } from "motion/react";
import { Menu, BookMarked } from "lucide-react";
import { surahs } from "../data/quran-data";
import { SurahCard } from "../components/SurahCard";
import { SearchBar } from "../components/SearchBar";
import { SettingsSidebar } from "../components/SettingsSidebar";

export function SurahListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const filteredSurahs = surahs.filter((surah) => {
    const query = searchQuery.toLowerCase();
    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.name.includes(query) ||
      surah.number.toString().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Header */}
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Menu className="w-5 h-5 text-primary" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-['Poppins'] font-semibold text-foreground">
                    Quran App
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Read & Reflect
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search surahs by name, translation, or number..."
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground font-['Inter']">
            {filteredSurahs.length}{" "}
            {filteredSurahs.length === 1 ? "surah" : "surahs"} found
          </p>
        </div>

        {/* Surah Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah, index) => (
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <SurahCard surah={surah} />
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredSurahs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <BookMarked className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-['Poppins'] text-foreground mb-2">
              No surahs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search query
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
