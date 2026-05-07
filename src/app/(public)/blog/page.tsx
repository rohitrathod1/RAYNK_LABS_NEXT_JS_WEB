import type { Metadata } from "next";
import { getBlogPageData, getPublishedBlogs } from "@/modules/blog/data/queries";
import { defaultSeo } from "@/modules/blog/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";
import { BlogContent } from "@/modules/blog/components/main";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo("blog", defaultSeo);
}

export default async function BlogPageServer() {
  const [data, { posts }, structuredData] = await Promise.all([
    getBlogPageData(),
    getPublishedBlogs(1, 12),
    getStructuredData("blog", defaultSeo),
  ]);

  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <BlogContent
        data={JSON.parse(JSON.stringify(data))}
        posts={JSON.parse(JSON.stringify(posts))}
      />
    </>
  );
}
