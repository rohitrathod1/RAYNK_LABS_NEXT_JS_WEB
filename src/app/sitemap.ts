import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Add new public routes here as pages are built.
// Dynamic routes (blog slugs, project slugs, etc.) should be fetched from DB.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    // { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    // { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    // { url: `${SITE_URL}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    // { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];

  // TODO: fetch dynamic slugs from Prisma and spread into the array
  // const projects = await db.project.findMany({ select: { slug: true, updatedAt: true } });
  // const projectRoutes = projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: p.updatedAt }));

  return [...staticRoutes];
}
