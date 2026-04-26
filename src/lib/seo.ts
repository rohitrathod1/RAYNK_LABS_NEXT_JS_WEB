// SEO metadata resolver — merges DB overrides with fallback defaults.
// Used in every public page's generateMetadata() function.

import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export interface PageSEO {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  noIndex?: boolean | null;
}

export function resolveSeo(seo: PageSEO | null, fallbackTitle?: string): Metadata {
  const title = seo?.title ?? fallbackTitle ?? SITE_NAME;
  const description = seo?.description ?? SITE_DESCRIPTION;
  const image = seo?.ogImage ?? `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    keywords: seo?.keywords ?? undefined,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: seo?.noIndex ? "noindex, nofollow" : "index, follow",
  };
}
