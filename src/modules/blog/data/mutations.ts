import { db } from "@/lib/db";

export async function upsertBlogSection(section: string, content: unknown) {
  return db.blogPage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date;
}) {
  return db.blogPost.create({ data });
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    author?: string;
    tags?: string[];
    isPublished?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    publishedAt?: Date;
  }
) {
  return db.blogPost.update({
    where: { id },
    data,
  });
}

export async function deleteBlogPost(id: string) {
  return db.blogPost.delete({
    where: { id },
  });
}

export async function publishBlogPost(id: string) {
  return db.blogPost.update({
    where: { id },
    data: { isPublished: true, publishedAt: new Date() },
  });
}

export async function unpublishBlogPost(id: string) {
  return db.blogPost.update({
    where: { id },
    data: { isPublished: false, publishedAt: null },
  });
}
