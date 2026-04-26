import dynamic from "next/dynamic";
import { HeroSection } from "./hero-section";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { HomePageData } from "../types";

// SEO content — code-split JS, preserves SSR for crawlers
const MissionSection = dynamic(
  () => import("./mission-section").then((m) => m.MissionSection),
  { loading: () => <SectionSkeleton /> },
);

const FeaturedProductsSection = dynamic(
  () => import("./featured-products-section").then((m) => m.FeaturedProductsSection),
  { loading: () => <SectionSkeleton /> },
);

const HealthBenefitsSection = dynamic(
  () => import("./health-benefits-section").then((m) => m.HealthBenefitsSection),
  { loading: () => <SectionSkeleton /> },
);

const TestimonialsSection = dynamic(
  () => import("./testimonials-section").then((m) => m.TestimonialsSection),
  { loading: () => <SectionSkeleton /> },
);

const CtaSection = dynamic(
  () => import("./cta-section").then((m) => m.CtaSection),
  { loading: () => <SectionSkeleton /> },
);

export function HomePageContent({ data }: { data: HomePageData }) {
  return (
    <main className="flex flex-col">
      <HeroSection data={data.hero} />
      <MissionSection data={data.mission} />
      <FeaturedProductsSection data={data["featured-products"]} />
      <HealthBenefitsSection data={data["health-benefits"]} />
      <TestimonialsSection data={data.testimonials} />
      <CtaSection data={data.cta} />
    </main>
  );
}
