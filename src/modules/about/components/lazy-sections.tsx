"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { AboutPageData } from "../types";
import { LazyAboutSection } from "./shared/lazy-about-section";
import { AboutGridSkeleton, AboutSplitSkeleton } from "./shared/skeletons";

const StorySection = dynamic(() => import("./story").then((module) => module.StorySection), {
  loading: () => <AboutSplitSkeleton />,
  ssr: false,
});

const StatsSection = dynamic(() => import("./stats").then((module) => module.StatsSection), {
  loading: () => <AboutGridSkeleton cards={4} />,
  ssr: false,
});

const MissionSection = dynamic(() => import("./mission").then((module) => module.MissionSection), {
  loading: () => <AboutGridSkeleton cards={3} />,
  ssr: false,
});

const WhyChooseSection = dynamic(
  () => import("./why-choose").then((module) => module.WhyChooseSection),
  { loading: () => <AboutGridSkeleton cards={6} />, ssr: false },
);

const TeamSection = dynamic(() => import("./team").then((module) => module.TeamSection), {
  loading: () => <AboutGridSkeleton cards={4} />,
  ssr: false,
});

const SocialLinksSection = dynamic(
  () => import("./social").then((module) => module.SocialLinksSection),
  { loading: () => <AboutGridSkeleton cards={3} />, ssr: false },
);

export function LazyAboutSections({ data }: { data: AboutPageData }) {
  const sections = [
    {
      key: "story",
      id: "section2-about-story",
      aliases: ["story"],
      fallback: <AboutSplitSkeleton />,
      minHeight: 680,
      node: <StorySection data={data.story} />,
    },
    {
      key: "stats",
      id: "section3-about-achievements",
      aliases: ["achievements"],
      fallback: <AboutGridSkeleton cards={4} />,
      minHeight: 360,
      node: <StatsSection data={data} />,
    },
    {
      key: "mission",
      id: "section4-about-mission",
      aliases: ["mission"],
      fallback: <AboutGridSkeleton cards={3} />,
      minHeight: 520,
      node: <MissionSection data={data.mission} />,
    },
    {
      key: "why-choose",
      id: "section5-about-why-choose-us",
      aliases: ["why-choose-us"],
      fallback: <AboutGridSkeleton cards={6} />,
      minHeight: 620,
      node: <WhyChooseSection data={data.why_choose_us} />,
    },
    {
      key: "team",
      id: "section6-about-team",
      aliases: ["team"],
      fallback: <AboutGridSkeleton cards={4} />,
      minHeight: 620,
      node: <TeamSection data={data.core_team} />,
    },
    {
      key: "social",
      id: "section7-about-connect",
      aliases: ["connect"],
      fallback: <AboutGridSkeleton cards={3} />,
      minHeight: 360,
      node: <SocialLinksSection data={data.social_links} />,
    },
  ];

  return (
    <>
      {sections.map((section) => (
        <LazyAboutSection
          key={section.key}
          id={section.id}
          aliases={section.aliases}
          fallback={section.fallback}
          minHeight={section.minHeight}
        >
          <Suspense fallback={section.fallback}>{section.node}</Suspense>
        </LazyAboutSection>
      ))}
    </>
  );
}
