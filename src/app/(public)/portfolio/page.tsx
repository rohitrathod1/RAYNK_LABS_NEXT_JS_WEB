import type { Metadata } from "next";
import { getPortfolioPageData, getPortfolioProjects, getPortfolioSeo } from "@/modules/portfolio/data/queries";
import { defaultSeo } from "@/modules/portfolio/data/defaults";
import { resolveSeo } from "@/lib/seo";
import PortfolioPageClient from "./page-content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPortfolioSeo();
  return resolveSeo(seo, defaultSeo.title ?? undefined);
}

export default async function PortfolioPageServer() {
  const [data, projects] = await Promise.all([
    getPortfolioPageData(),
    getPortfolioProjects(),
  ]);

  return (
    <PortfolioPageClient
      data={JSON.parse(JSON.stringify(data))}
      projects={JSON.parse(JSON.stringify(projects))}
    />
  );
}
