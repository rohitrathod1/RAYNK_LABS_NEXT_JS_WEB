import type { Metadata } from "next";
import { HomePageContent } from "@/modules/home";
import { getHomePageData } from "@/modules/home/data/queries";
import { defaultSeo } from "@/modules/home/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("home", defaultSeo);
}

export default async function HomePageServer() {
  const [data, structuredData] = await Promise.all([
    getHomePageData(),
    getStructuredData("home", defaultSeo),
  ]);
  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <HomePageContent data={JSON.parse(JSON.stringify(data))} />
    </>
  );
}
