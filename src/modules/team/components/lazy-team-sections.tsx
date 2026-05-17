"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LazyOnView } from "@/components/shared/lazy-on-view";
import type { TeamMember, TeamPageData } from "../types";
import { TeamShowcaseSkeleton } from "./team-showcase";

const TeamShowcase = dynamic(
  () => import("./team-showcase").then((module) => module.TeamShowcase),
  { loading: () => <TeamShowcaseSkeleton /> },
);

export function LazyTeamSections({
  data,
  members,
}: {
  data: TeamPageData;
  members: TeamMember[];
}) {
  return (
    <LazyOnView fallback={<TeamShowcaseSkeleton />} rootMargin="450px" minHeight={1000}>
      <Suspense fallback={<TeamShowcaseSkeleton />}>
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
