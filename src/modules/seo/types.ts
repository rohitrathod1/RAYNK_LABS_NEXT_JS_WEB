export type TwitterCard = "summary" | "summary_large_image";

export type RobotsDirective =
  | "index,follow"
  | "noindex,follow"
  | "index,nofollow"
  | "noindex,nofollow";

export interface SeoFormData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: TwitterCard;
  canonicalUrl: string;
  robots: RobotsDirective;
}

export interface SeoListItem {
  id: string;
  page: string;
  title: string | null;
  description: string | null;
  robots: string;
  updatedAt: string;
}
