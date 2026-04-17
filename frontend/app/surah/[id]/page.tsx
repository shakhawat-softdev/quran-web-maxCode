import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurahs, getSurahDetail } from "@/service/api";
import SurahDetailClient from "./SurahDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate static params for all 114 surahs (SSG)
export async function generateStaticParams() {
  try {
    const surahs = await getSurahs();
    return surahs.map((surah) => ({
      id: surah.number.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Return an empty array on error - ISR will handle it
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const surahNumber = Number(resolvedParams.id);
    const result = await getSurahDetail(surahNumber);
    if (!result) {
      return {
        title: "Surah Not Found",
      };
    }

    const surah = result.surah;

    return {
      title: `${surah.englishName} (${surah.name}) - Quran App`,
      description: `Read Surah ${surah.englishName} (${surah.englishNameTranslation}) - ${surah.numberOfAyahs} ayahs, ${surah.revelationType} revelation`,
      keywords: [
        surah.englishName,
        surah.name,
        "Quran",
        "Surah",
        surah.revelationType,
      ],
      openGraph: {
        title: `${surah.englishName} - Quran App`,
        description: `Read Surah ${surah.englishName} with translations and interpretations`,
        type: "article",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Surah - Quran App",
    };
  }
}

// Revalidate the page every hour
export const revalidate = 3600;

export default async function SurahPage({ params }: Props) {
  try {
    const resolvedParams = await params;
    const surahNumber = Number(resolvedParams.id);

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      notFound();
    }

    const result = await getSurahDetail(surahNumber);

    if (!result) {
      notFound();
    }

    return <SurahDetailClient surah={result.surah} ayahs={result.ayahs} />;
  } catch (error) {
    console.error("Error loading surah:", error);
    notFound();
  }
}
