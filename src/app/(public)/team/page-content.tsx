import type { Metadata } from "next";
import { TeamPageContent } from "@/modules/team";
import { getTeamMembers } from "@/modules/team/data/queries";
import { defaultSeo } from "@/modules/team/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("team", defaultSeo);
}

export default async function TeamPageServer() {
  const [structuredData, members] = await Promise.all([
    getStructuredData("team", defaultSeo),
    getTeamMembers(),
  ]);

  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "RaYnk Labs",
          url: "https://raynklabs.vercel.app",
          employee: members.slice(0, 20).map((member) => ({
            "@type": "Person",
            name: member.displayName,
            jobTitle: member.role,
            email: member.email,
            telephone: member.phone,
            url: member.portfolioUrl,
            sameAs: [
              member.githubUrl,
              member.linkedinUrl,
              member.instagramUrl,
              member.youtubeUrl,
            ].filter(Boolean),
          })),
        }}
      />
      <TeamPageContent />
    </>
  );
}
