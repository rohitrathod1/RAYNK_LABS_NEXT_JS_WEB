import type { ContactPageData } from "../types";
import { HeroSection } from "./hero";
import { LazyContactSections } from "./lazy-contact-sections";

export function ContactPageContent({ data }: { data: ContactPageData }) {
  return (
    <main className="flex flex-col">
      <HeroSection {...data.hero} />
      <LazyContactSections data={JSON.parse(JSON.stringify(data))} />
    </main>
  );
}
