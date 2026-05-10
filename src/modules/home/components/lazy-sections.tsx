"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { HomePageData } from "../types";
import { LazyHomeSection } from "./shared/lazy-home-section";
import { HomeGridSkeleton, HomeSplitSkeleton } from "./shared/skeletons";

const InitiativesSection = dynamic(
  () => import("./initiatives-section").then((module) => module.InitiativesSection),
  { loading: () => <HomeGridSkeleton cards={4} />, ssr: false },
);

const ServicesSection = dynamic(
  () => import("./services-section").then((module) => module.ServicesSection),
  { loading: () => <HomeGridSkeleton cards={6} />, ssr: false },
);

const WhyDigitalSection = dynamic(
  () => import("./why-digital-section").then((module) => module.WhyDigitalSection),
  { loading: () => <HomeSplitSkeleton />, ssr: false },
);

const PortfolioSection = dynamic(
  () => import("./portfolio-section").then((module) => module.PortfolioSection),
  { loading: () => <HomeGridSkeleton cards={3} />, ssr: false },
);

const TestimonialsSection = dynamic(
  () => import("./testimonials-section").then((module) => module.TestimonialsSection),
  { loading: () => <HomeGridSkeleton cards={3} />, ssr: false },
);

const WhyChooseSection = dynamic(
  () => import("./why-choose-section").then((module) => module.WhyChooseSection),
  { loading: () => <HomeGridSkeleton cards={6} />, ssr: false },
);

const CtaSection = dynamic(
  () => import("./cta-section").then((module) => module.CtaSection),
  { loading: () => <HomeGridSkeleton cards={0} />, ssr: false },
);

export function LazyHomeSections({ data }: { data: HomePageData }) {
  const sections = [
    {
      key: "initiatives",
      id: "section2-home-initiatives",
      aliases: ["initiatives"],
      fallback: <HomeGridSkeleton cards={4} />,
      minHeight: 520,
      node: <InitiativesSection data={data.initiatives} />,
    },
    {
      key: "services",
      id: "section3-home-services",
      aliases: ["services"],
      fallback: <HomeGridSkeleton cards={6} />,
      minHeight: 680,
      node: <ServicesSection data={data.services} />,
    },
    {
      key: "why-digital",
      id: "section4-home-digital",
      aliases: ["why-digital"],
      fallback: <HomeSplitSkeleton />,
      minHeight: 560,
      node: <WhyDigitalSection data={data.why_digital} />,
    },
    {
      key: "portfolio",
      id: "section5-home-portfolio",
      aliases: ["portfolio"],
      fallback: <HomeGridSkeleton cards={3} />,
      minHeight: 620,
      node: <PortfolioSection data={data.portfolio_preview} />,
    },
    {
      key: "testimonials",
      id: "section6-home-testimonials",
      aliases: ["testimonials"],
      fallback: <HomeGridSkeleton cards={3} />,
      minHeight: 540,
      node: <TestimonialsSection data={data.testimonials} />,
    },
    {
      key: "why-choose",
      id: "section7-home-why-choose-us",
      aliases: ["why-choose-us"],
      fallback: <HomeGridSkeleton cards={6} />,
      minHeight: 620,
      node: <WhyChooseSection data={data.why_choose_us} />,
    },
    {
      key: "cta",
      id: "section8-home-contact",
      aliases: ["contact"],
      fallback: <HomeGridSkeleton cards={0} />,
      minHeight: 320,
      node: <CtaSection data={data.contact_cta} />,
    },
  ];

  return (
    <>
      {sections.map((section) => (
        <LazyHomeSection
          key={section.key}
          id={section.id}
          aliases={section.aliases}
          fallback={section.fallback}
          minHeight={section.minHeight}
        >
          <Suspense fallback={section.fallback}>{section.node}</Suspense>
        </LazyHomeSection>
      ))}
    </>
  );
}
