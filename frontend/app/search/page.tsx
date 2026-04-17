import type { Metadata } from "next";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search - Quran App",
  description: "Search through Quranic verses by text or translation",
};

export default function SearchPage() {
  return <SearchClient />;
}
