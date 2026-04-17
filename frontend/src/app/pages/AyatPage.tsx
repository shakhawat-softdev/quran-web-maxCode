import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Menu, BookOpen } from "lucide-react";
import { getSurahByNumber, getAyahsBySurah } from "../data/quran-data";
import { AyahItem } from "../components/AyahItem";
import { SettingsSidebar } from "../components/SettingsSidebar";

export function AyatPage() {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const surah = getSurahByNumber(Number(surahNumber));
  const ayahs = getAyahsBySurah(Number(surahNumber));

  if (!surah) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-['Poppins'] text-foreground mb-2">
            Surah not found
          </h2>
          <Link to="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Link>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Menu className="w-5 h-5 text-primary" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-['Poppins'] font-semibold text-foreground">
                    {surah.englishName}
                  </h1>
                  <span className="font-['Amiri'] text-xl text-primary">
                    {surah.name}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {surah.englishNameTranslation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Surah Info Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 mb-8 text-primary-foreground shadow-lg"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="font-['Amiri'] text-4xl mb-2">{surah.name}</h2>
            <h3 className="font-['Poppins'] text-xl mb-3">
              {surah.englishName}
            </h3>
            <p className="text-primary-foreground/90 mb-4">
              {surah.englishNameTranslation}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{surah.numberOfAyahs} Ayahs</span>
              </div>
              <span>•</span>
              <span>{surah.revelationType}</span>
            </div>
          </div>
        </motion.div>

        {/* Bismillah */}
        {surah.number !== 1 && surah.number !== 9 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="font-['Amiri'] text-3xl text-primary">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </motion.div>
        )}

        {/* Ayahs List */}
        {ayahs.length > 0 ? (
          <div className="space-y-6">
            {ayahs.map((ayah, index) => (
              <motion.div
                key={ayah.number}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <AyahItem ayah={ayah} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-card rounded-2xl border border-border"
          >
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-['Poppins'] text-foreground mb-2">
              Ayahs coming soon
            </h3>
            <p className="text-muted-foreground mb-6">
              This surah's verses will be available shortly
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Surahs
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
