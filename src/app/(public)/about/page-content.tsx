import type { Metadata } from "next";
import { AboutPageContent } from "@/modules/about";
import { getAboutPageData, getAboutSeo } from "@/modules/about/data/queries";
import { defaultSeo } from "@/modules/about/data/defaults";
import { resolveSeo } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getAboutSeo();
  return resolveSeo(seo, defaultSeo.title ?? undefined);
}

export default async function AboutPageServer() {
  const data = await getAboutPageData();
  return <AboutPageContent data={JSON.parse(JSON.stringify(data))} />;
}
