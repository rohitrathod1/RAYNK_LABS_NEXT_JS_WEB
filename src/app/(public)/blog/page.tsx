import type { Metadata } from "next";
import { getBlogPageData, getPublishedBlogs, getBlogSeo } from "@/modules/blog/data/queries";
import { defaultSeo } from "@/modules/blog/data/defaults";
import { resolveSeo } from "@/lib/seo";
import { BlogContent } from "@/modules/blog/components/main";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getBlogSeo();
  return resolveSeo(seo, defaultSeo.title ?? undefined);
}

export default async function BlogPageServer() {
  const [data, { posts }] = await Promise.all([
    getBlogPageData(),
    getPublishedBlogs(1, 12),
  ]);

  return (
    <BlogContent
      data={JSON.parse(JSON.stringify(data))}
      posts={JSON.parse(JSON.stringify(posts))}
    />
  );
}
