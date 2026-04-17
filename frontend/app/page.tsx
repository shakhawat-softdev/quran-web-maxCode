import { Metadata } from "next";
import { getSurahs } from "@/lib/api";
import { SurahListClient } from "./SurahListClient";

export const metadata: Metadata = {
  title: "Quran App - Read and Reflect",
  description:
    "Read the Quran in Arabic and English translations with beautiful typography and search functionality",
  keywords: ["Quran", "Islamic", "Read", "Translation"],
  openGraph: {
    title: "Quran App",
    description: "Read and reflect on the Quran",
    type: "website",
  },
};

// Revalidate the page every hour
export const revalidate = 3600;

export default async function Home() {
  try {
    const surahs = await getSurahs();
    return <SurahListClient initialSurahs={surahs} />;
  } catch (error) {
    console.error("Error loading surahs:", error);
    // Fallback: render with empty list or error message
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Error Loading Surahs
          </h1>
          <p className="text-muted-foreground">
            Unable to load Quran data. Please refresh the page or check your
            connection.
          </p>
        </div>
      </div>
    );
  }
}
