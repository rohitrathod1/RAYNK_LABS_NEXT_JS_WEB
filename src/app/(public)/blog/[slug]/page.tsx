import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getRelatedPosts, getBlogSeo } from "@/modules/blog/data/queries";
import { defaultSeo } from "@/modules/blog/data/defaults";
import { resolveSeo } from "@/lib/seo";
import { BlogDetail } from "@/modules/blog/components/blog-detail";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return resolveSeo(await getBlogSeo(), defaultSeo.title ?? undefined);
  }

  const seo = await getBlogSeo();
  return resolveSeo(
    {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      keywords: post.tags?.join(", ") ?? undefined,
      ogImage: post.coverImage ?? undefined,
    },
    seo?.metaTitle ?? undefined
  );
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
