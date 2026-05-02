import { db } from "@/lib/db";
import type { BlogPageData, BlogPostItem } from "../types";
import { defaultBlogContent } from "./defaults";

export async function getBlogPageData(): Promise<BlogPageData> {
  const sections = await db.blogPage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const data: Record<string, unknown> = {};
  for (const s of sections) data[s.section] = s.content;

  return {
    hero: (data.hero as BlogPageData["hero"]) ?? defaultBlogContent.hero,
    blog_list: (data.blog_list as BlogPageData["blog_list"]) ?? defaultBlogContent.blog_list,
  };
}

export async function getPublishedBlogs(page = 1, limit = 9): Promise<{ posts: BlogPostItem[]; total: number }> {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    db.blogPost.count({
      where: { isPublished: true },
    }),
  ]);

  return { posts: posts as BlogPostItem[], total };
}

export async function getBlogBySlug(slug: string) {
  return db.blogPost.findUnique({
    where: { slug, isPublished: true },
  });
}

export async function getRelatedPosts(currentId: string, tags: string[], limit = 3) {
  return db.blogPost.findMany({
    where: {
      isPublished: true,
      id: { not: currentId },
      tags: { hasSome: tags },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getBlogSeo() {
  return db.seoPage.findUnique({ where: { page: "blog" } });
}

export async function getBlogSection(section: string) {
  return db.blogPage.findUnique({ where: { section } });
}

export async function getAllBlogsAdmin() {
  return db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
}
