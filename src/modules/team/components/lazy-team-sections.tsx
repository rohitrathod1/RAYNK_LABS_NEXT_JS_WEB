"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LazyOnView } from "@/components/shared/lazy-on-view";
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { TeamMember, TeamPageData } from "../types";

const TeamShowcase = dynamic(
  () => import("./team-showcase").then((module) => module.TeamShowcase),
  { loading: () => <SectionSkeleton /> },
);

export function LazyTeamSections({
  data,
  members,
}: {
  data: TeamPageData;
  members: TeamMember[];
}) {
  return (
    <LazyOnView fallback={<SectionSkeleton />} rootMargin="450px" minHeight={760}>
      <Suspense fallback={<SectionSkeleton />}>
        <TeamShowcase
          intro={data.intro}
          membersSection={data.team_members}
          values={data.values}
          cta={data.contact_cta}
          members={members}
        />
      </Suspense>
    </LazyOnView>
  );
}

