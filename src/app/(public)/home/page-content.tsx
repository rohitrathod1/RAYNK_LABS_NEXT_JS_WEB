import type { Metadata } from "next";
import { HomePageContent } from "@/modules/home";
import { getHomePageData, getHomeSeo } from "@/modules/home/data/queries";
import { defaultSeo } from "@/modules/home/data/defaults";
import { resolveSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo();
  return resolveSeo(seo, defaultSeo.title ?? undefined);
}

export default async function HomePageServer() {
  const data = await getHomePageData();
  return <HomePageContent data={JSON.parse(JSON.stringify(data))} />;
}
