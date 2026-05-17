import { HeroSectionSkeleton } from "@/modules/team/components/hero";
import { TeamShowcaseSkeleton } from "@/modules/team/components/team-showcase";

export default function TeamLoading() {
  return (
    <main>
      <HeroSectionSkeleton />
      <TeamShowcaseSkeleton />
    </main>
  );
}
