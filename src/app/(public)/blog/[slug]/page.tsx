import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getRelatedPosts } from "@/modules/blog/data/queries";
import { defaultSeo } from "@/modules/blog/data/defaults";
import { resolveSeo } from "@/modules/seo/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { BlogDetail } from "@/modules/blog/components/blog-detail";

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
  const image = post.coverImage
    ? post.coverImage.startsWith("http") || post.coverImage.startsWith("/")
      ? post.coverImage
      : `/api/uploads/${post.coverImage}`
    : undefined;

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
    <BlogDetail
      post={JSON.parse(JSON.stringify(post))}
      relatedPosts={JSON.parse(JSON.stringify(related))}
    />
  );
}
