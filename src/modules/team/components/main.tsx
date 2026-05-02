import { HeroSection } from "./hero";
import { IntroSection } from "./intro";
import { FoundersSection } from "./founders";
import { TeamGrid } from "./team-grid";
import { ValuesSection } from "./values";
import { CtaSection } from "./cta";
import { getTeamPageData, getTeamMembers } from "@/modules/team";

export async function TeamPageContent() {
  const [pageData, teamMembers] = await Promise.all([
    getTeamPageData(),
    getTeamMembers(),
  ]);

  return (
    <>
      <HeroSection data={pageData.hero} />
      <IntroSection data={pageData.intro} />
      <FoundersSection data={pageData.founders} />
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{pageData.team_members.title}</h2>
            <p className="text-lg text-muted-foreground">{pageData.team_members.subtitle}</p>
          </div>
          <TeamGrid members={teamMembers} />
        </div>
      </section>
      <ValuesSection data={pageData.values} />
      <CtaSection data={pageData.contact_cta} />
    </>
  );
}
