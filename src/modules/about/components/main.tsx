import { HeroSection } from "./hero-section";
import type { AboutPageData } from "../types";
import { LazyAboutSections } from "./lazy-sections";

export function AboutPageContent({ data }: { data: AboutPageData }) {
  return (
    <main className="flex flex-col">
      <HeroSection data={data.hero} />
      <LazyAboutSections data={data} />
    </main>
  );
}
