// SEO metadata resolver — merges DB overrides with fallback defaults.
// Used in every public page's generateMetadata() function.

import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { db } from "@/lib/db";
import type { RobotsDirective } from "@/modules/seo/types";

export interface PageSEO {
  title?: string | null;
  description?: string | null;
  keywords?: string | string[] | null;
  ogImage?: string | null;
  noIndex?: boolean | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  isIndexed?: boolean | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  twitterCard?: string | null;
  structuredData?: unknown;
  robots?: RobotsDirective | string | null;
}

export async function getSeoData(pageName: string) {
  return db.seoMeta.findUnique({
    where: { page: pageName },
  });
}

function resolveImage(value?: string | null) {
  if (!value) return `${SITE_URL}/og-image.png`;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${SITE_URL}${value}`;
  return `${SITE_URL}/api/uploads/${encodeURIComponent(value)}`;
}

export function resolveSeo(seo: PageSEO | null, fallbackTitle?: string): Metadata {
  const title = seo?.metaTitle ?? seo?.title ?? fallbackTitle ?? SITE_NAME;
  const description = seo?.metaDescription ?? seo?.description ?? SITE_DESCRIPTION;
  const image = resolveImage(seo?.ogImage);
  const ogTitle = seo?.ogTitle ?? title;
  const ogDescription = seo?.ogDescription ?? description;
  const keywords = Array.isArray(seo?.keywords)
    ? seo.keywords.join(", ")
    : seo?.keywords ?? undefined;
  const canonical = seo?.canonicalUrl || SITE_URL;
  const twitterCard = seo?.twitterCard === "summary" ? "summary" : "summary_large_image";
  const robots = seo?.robots
    ? {
        index: !seo.robots.includes("noindex"),
        follow: !seo.robots.includes("nofollow"),
      }
    : seo?.noIndex || seo?.isIndexed === false
      ? { index: false, follow: false }
      : { index: true, follow: true };

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
    robots,
  };
}
