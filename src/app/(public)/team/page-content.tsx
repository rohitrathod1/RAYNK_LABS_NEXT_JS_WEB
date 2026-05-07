import type { Metadata } from "next";
import { TeamPageContent } from "@/modules/team";
import { defaultSeo } from "@/modules/team/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("team", defaultSeo);
}

export default async function TeamPageServer() {
  const structuredData = await getStructuredData("team", defaultSeo);
  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <TeamPageContent />
    </>
  );
}
