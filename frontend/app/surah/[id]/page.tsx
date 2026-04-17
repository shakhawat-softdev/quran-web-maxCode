import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSurahById, getAyahsBySurah, getAllSurahNumbers } from '@/lib/api';
import SurahDetailClient from './SurahDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

// Generate static params for all 114 surahs (SSG)
export async function generateStaticParams() {
  const surahNumbers = await getAllSurahNumbers();
  return surahNumbers.map((num) => ({
    id: num.toString(),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const surah = await getSurahById(Number(resolvedParams.id));
  
  if (!surah) {
    return {
      title: 'Surah Not Found',
    };
  }

  return {
    title: `${surah.englishName} (${surah.name}) - Quran App`,
    description: `Read Surah ${surah.englishName} (${surah.englishNameTranslation}) - ${surah.numberOfAyahs} ayahs, ${surah.revelationType} revelation`,
    keywords: [surah.englishName, surah.name, 'Quran', 'Surah', surah.revelationType],
  };
}

export default async function SurahPage({ params }: Props) {
  const resolvedParams = await params;
  const surahNumber = Number(resolvedParams.id);
  
  const [surah, ayahs] = await Promise.all([
    getSurahById(surahNumber),
    getAyahsBySurah(surahNumber),
  ]);

  if (!surah) {
    notFound();
  }

  return <SurahDetailClient surah={surah} ayahs={ayahs} />;
}
