import type { PageSEO } from "@/lib/seo";
import type { BlogPageData } from "../types";

export const defaultSeo: PageSEO = {
  title: "RaYnk Labs — Blog | Insights & Updates",
  description:
    "Read our latest insights on web development, design, technology trends, and digital transformation. Expert tips and industry updates from RaYnk Labs.",
  keywords: "blog, web development, technology, design, digital transformation, RaYnk Labs insights",
  ogImage: "/api/uploads/og-blog.png",
  noIndex: false,
};

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
