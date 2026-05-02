import type { Metadata } from "next";
import { TeamPageContent } from "@/modules/team";
import { getTeamSeo } from "@/modules/team/data/queries";
import { defaultSeo } from "@/modules/team/data/defaults";
import { resolveSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getTeamSeo();
  return resolveSeo(seo, defaultSeo.title ?? undefined);
}

export default async function TeamPageServer() {
  return <TeamPageContent />;
}
