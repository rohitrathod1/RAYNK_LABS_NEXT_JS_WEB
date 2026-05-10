import type { Metadata } from "next";
import { getBlogPageData, getPublishedBlogs } from "@/modules/blog/data/queries";
import { defaultSeo } from "@/modules/blog/data/defaults";
import { resolveSeo, getStructuredData } from "@/modules/seo/utils";
import { JsonLd } from "@/components/shared";
import { BlogContent } from "@/modules/blog/components/main";
import { SITE_URL } from "@/lib/constants";

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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: data.hero.title,
          description: data.hero.subtitle,
          url: `${SITE_URL}/blog`,
          blogPost: posts.slice(0, 12).map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt ?? post.createdAt,
            dateModified: post.updatedAt,
            author: { "@type": "Person", name: post.author },
            url: `${SITE_URL}/blog/${post.slug}`,
          })),
        }}
      />
      <BlogContent
        data={JSON.parse(JSON.stringify(data))}
        posts={JSON.parse(JSON.stringify(posts))}
      />
    </>
  );
}
