import type { Metadata } from "next";
import { getPortfolioPageData, getPortfolioProjects } from "@/modules/portfolio/data/queries";
import { defaultSeo } from "@/modules/portfolio/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";
import { PortfolioHero } from "@/modules/portfolio/components/hero";
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: data.hero.title,
          description: data.hero.subtitle,
          url: "https://raynklabs.vercel.app/portfolio",
          mainEntity: projects.slice(0, 12).map((project) => ({
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            image: project.image,
            url: `https://raynklabs.vercel.app/portfolio/${project.slug}`,
          })),
        }}
      />
      <main className="flex flex-col">
        <PortfolioHero data={data.hero} />
        <PortfolioPageClient
          data={JSON.parse(JSON.stringify(data))}
          projects={JSON.parse(JSON.stringify(projects))}
        />
      </main>
    </>
  );
}
