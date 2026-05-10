import { HeroSection } from "./hero-section";
import type { HomePageData } from "../types";
import { LazyHomeSections } from "./lazy-sections";

export function HomePageContent({ data }: { data: HomePageData }) {
  return (
    <main className="flex flex-col">
      <HeroSection data={data.hero} />
      <LazyHomeSections data={data} />
    </main>
  );
}
