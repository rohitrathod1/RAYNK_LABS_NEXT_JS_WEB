import { HeroSection } from "./hero";
import { LazyTeamSections } from "./lazy-team-sections";
import { getTeamPageData, getTeamMembers } from "@/modules/team";

export async function TeamPageContent() {
  const [pageData, teamMembers] = await Promise.all([
    getTeamPageData(),
    getTeamMembers(),
  ]);

  return (
    <main className="flex flex-col">
      <HeroSection data={pageData.hero} />
      <LazyTeamSections
        data={JSON.parse(JSON.stringify(pageData))}
        members={JSON.parse(JSON.stringify(teamMembers))}
      />
    </main>
  );
}
