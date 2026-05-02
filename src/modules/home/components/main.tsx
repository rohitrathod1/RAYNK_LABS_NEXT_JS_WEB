import { HeroSection } from "./hero-section";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { HomePageData } from "../types";

const InitiativesSection = dynamic(
  () => import("./initiatives-section").then((m) => m.InitiativesSection),
  { loading: () => <SectionSkeleton /> },
);

const ServicesSection = dynamic(
  () => import("./services-section").then((m) => m.ServicesSection),
  { loading: () => <SectionSkeleton /> },
);

const WhyDigitalSection = dynamic(
  () => import("./why-digital-section").then((m) => m.WhyDigitalSection),
  { loading: () => <SectionSkeleton /> },
);

const PortfolioSection = dynamic(
  () => import("./portfolio-section").then((m) => m.PortfolioSection),
  { loading: () => <SectionSkeleton /> },
);

const TestimonialsSection = dynamic(
  () => import("./testimonials-section").then((m) => m.TestimonialsSection),
  { loading: () => <SectionSkeleton /> },
);

const WhyChooseSection = dynamic(
  () => import("./why-choose-section").then((m) => m.WhyChooseSection),
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
      <InitiativesSection data={data.initiatives} />
      <ServicesSection data={data.services} />
      <WhyDigitalSection data={data.why_digital} />
      <PortfolioSection data={data.portfolio_preview} />
      <TestimonialsSection data={data.testimonials} />
      <WhyChooseSection data={data.why_choose_us} />
      <CtaSection data={data.contact_cta} />
    </main>
  );
}
