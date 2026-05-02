import { HeroSection } from "./hero-section";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { AboutPageData } from "../types";

const StorySection = dynamic(
  () => import("./story").then((m) => m.StorySection),
  { loading: () => <SectionSkeleton /> },
);

const MissionSection = dynamic(
  () => import("./mission").then((m) => m.MissionSection),
  { loading: () => <SectionSkeleton /> },
);

const WhyChooseSection = dynamic(
  () => import("./why-choose").then((m) => m.WhyChooseSection),
  { loading: () => <SectionSkeleton /> },
);

const TeamSection = dynamic(
  () => import("./team").then((m) => m.TeamSection),
  { loading: () => <SectionSkeleton /> },
);

const SocialLinksSection = dynamic(
  () => import("./social").then((m) => m.SocialLinksSection),
  { loading: () => <SectionSkeleton /> },
);

export function AboutPageContent({ data }: { data: AboutPageData }) {
  return (
    <main className="flex flex-col">
      <HeroSection data={data.hero} />
      <StorySection data={data.story} />
      <MissionSection data={data.mission} />
      <WhyChooseSection data={data.why_choose_us} />
      <TeamSection data={data.core_team} />
      <SocialLinksSection data={data.social_links} />
    </main>
  );
}
