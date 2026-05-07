import type { Metadata } from "next";
import { AboutPageContent } from "@/modules/about";
import { getAboutPageData } from "@/modules/about/data/queries";
import { defaultSeo } from "@/modules/about/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("about", defaultSeo);
}

export default async function AboutPageServer() {
  const [data, structuredData] = await Promise.all([
    getAboutPageData(),
    getStructuredData("about", defaultSeo),
  ]);
  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <AboutPageContent data={JSON.parse(JSON.stringify(data))} />
    </>
  );
}
