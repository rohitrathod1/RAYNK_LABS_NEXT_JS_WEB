export type TwitterCard = "summary" | "summary_large_image";

export type RobotsDirective =
  | "index,follow"
  | "noindex,follow"
  | "index,nofollow"
  | "noindex,nofollow";

export interface SeoFormData {
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface SeoListItem {
  id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string | null;
  canonicalUrl: string | null;
  updatedAt: string;
}
