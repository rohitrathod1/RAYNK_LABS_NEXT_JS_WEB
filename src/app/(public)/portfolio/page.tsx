import type { Metadata } from "next";
import { getPortfolioPageData, getPortfolioProjects } from "@/modules/portfolio/data/queries";
import { defaultSeo } from "@/modules/portfolio/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";
import PortfolioPageClient from "./page-content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("portfolio", defaultSeo);
}

export default async function PortfolioPageServer() {
  const [data, projects, structuredData] = await Promise.all([
    getPortfolioPageData(),
    getPortfolioProjects(),
    getStructuredData("portfolio", defaultSeo),
  ]);

  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <PortfolioPageClient
        data={JSON.parse(JSON.stringify(data))}
        projects={JSON.parse(JSON.stringify(projects))}
      />
    </>
  );
}
