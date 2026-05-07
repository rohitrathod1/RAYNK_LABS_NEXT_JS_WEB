import { definePageSeo } from "@/modules/seo";
import type { BlogPageData } from "../types";

export const defaultSeo = definePageSeo({
  metaTitle: "Blog - RaYnk Labs Insights",
  metaDescription: "Read insights, tutorials, and updates from RaYnk Labs on web development, design, SEO, and digital innovation.",
  keywords: ["raynk labs blog", "web development", "design", "seo", "digital innovation"],
  ogTitle: "RaYnk Labs Blog",
  ogDescription: "Ideas and insights on software, design, SEO, and digital growth.",
  ogImage: "og-blog.png",
  twitterCard: "summary_large_image",
  canonicalUrl: "http://localhost:3000/blog",
  structuredData: { "@type": "Blog", name: "RaYnk Labs Blog" },
  robots: "index,follow",
});
export const defaultBlogContent: BlogPageData = {
  hero: {
    title: "Our Blog",
    subtitle: "Insights, tutorials, and updates from our team of developers and designers.",
    backgroundImage: "placeholder.png",
  },
  blog_list: {
    title: "Latest Articles",
    subtitle: "Stay up to date with the latest trends and best practices in technology.",
  },
};
