import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getRelatedPosts } from "@/modules/blog/data/queries";
import { defaultSeo } from "@/modules/blog/data/defaults";
import { resolveSeo } from "@/modules/seo/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { BlogDetail } from "@/modules/blog/components/blog-detail";
import { JsonLd } from "@/components/shared";
import { resolveImageSrc } from "@/lib/image-url";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return resolveSeo("blog", defaultSeo);
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;
  const image = post.coverImage ? resolveImageSrc(post.coverImage) : undefined;

  return {
    title: title.includes(SITE_NAME) ? { absolute: title } : title,
    description,
    keywords: post.tags ?? undefined,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: SITE_NAME,
      type: "article",
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(post.id, post.tags ?? [], 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          image: post.coverImage ? resolveImageSrc(post.coverImage) : undefined,
          datePublished: post.publishedAt ?? post.createdAt,
          dateModified: post.updatedAt,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: SITE_NAME },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        }}
      />
      <BlogDetail
        post={JSON.parse(JSON.stringify(post))}
        relatedPosts={JSON.parse(JSON.stringify(related))}
      />
    </>
  );
}
