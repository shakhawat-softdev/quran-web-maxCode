'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { type Surah } from '@/lib/quran-data';
import { BookOpen } from 'lucide-react';

interface SurahCardProps {
  surah: Surah;
}

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link href={`/surah/${surah.number}`}>
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(6, 95, 70, 0.15)' }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-xl p-6 border border-border shadow-sm hover:border-primary/30 cursor-pointer group"
      >
        <div className="flex items-start gap-4">
          {/* Surah Number Badge */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-primary font-medium">{surah.number}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-['Poppins'] text-foreground group-hover:text-primary transition-colors">
                  {surah.englishName}
                </h3>
                <p className="text-sm text-muted-foreground">{surah.englishNameTranslation}</p>
              </div>
              <div className="text-right">
                <p className="font-['Amiri'] text-2xl text-primary leading-tight mb-1">{surah.name}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{surah.numberOfAyahs} Ayahs</span>
              </div>
              <span>•</span>
              <span>{surah.revelationType}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
