"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  blogHeroSchema,
  blogListSchema,
  blogPostSchema,
  seoSchema,
} from "./validations";
import {
  upsertBlogSection,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "./data/mutations";

function revalidateBlog() {
  revalidatePath("/blog");
  revalidatePath("/admin/dashboard/blogs");
}

export async function updateBlogHero(raw: unknown) {
  try {
    await requirePermission("MANAGE_BLOG");
    const data = blogHeroSchema.parse(raw);
    await upsertBlogSection("hero", data);
    revalidateBlog();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateBlogList(raw: unknown) {
  try {
    await requirePermission("MANAGE_BLOG");
    const data = blogListSchema.parse(raw);
    await upsertBlogSection("blog_list", data);
    revalidateBlog();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateBlogSeo(raw: unknown) {
  try {
    await requirePermission("MANAGE_BLOG");
    const data = seoSchema.parse(raw);
    await db.seo.upsert({
      where: { page: "blog" },
      update: { ...data, updatedAt: new Date() },
      create: { page: "blog", ...data },
    });
    revalidatePath("/blog");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function createBlogPostAction(raw: unknown) {
  try {
    await requirePermission("MANAGE_BLOG");
    const validated = blogPostSchema.parse(raw);
    const tagsArray = validated.tags
      ? validated.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const post = await createBlogPost({
      title: validated.title,
      slug: validated.slug,
      excerpt: validated.excerpt || undefined,
      content: validated.content,
      coverImage: validated.coverImage || undefined,
      author: validated.author,
      tags: tagsArray,
      isPublished: validated.isPublished,
      metaTitle: validated.metaTitle || undefined,
      metaDescription: validated.metaDescription || undefined,
      publishedAt: validated.isPublished ? new Date() : undefined,
    });
    revalidateBlog();
    return ok(post);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateBlogPostAction(id: string, raw: unknown) {
  try {
    await requirePermission("MANAGE_BLOG");
    const validated = blogPostSchema.parse(raw);
    const tagsArray = validated.tags
      ? validated.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const post = await updateBlogPost(id, {
      title: validated.title,
      slug: validated.slug,
      excerpt: validated.excerpt || undefined,
      content: validated.content,
      coverImage: validated.coverImage || undefined,
      author: validated.author,
      tags: tagsArray,
      isPublished: validated.isPublished,
      metaTitle: validated.metaTitle || undefined,
      metaDescription: validated.metaDescription || undefined,
      publishedAt: validated.isPublished ? new Date() : undefined,
    });
    revalidateBlog();
    return ok(post);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    await requirePermission("MANAGE_BLOG");
    await deleteBlogPost(id);
    revalidateBlog();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function toggleBlogPublishAction(id: string, isPublished: boolean) {
  try {
    await requirePermission("MANAGE_BLOG");
    await db.blogPost.update({
      where: { id },
      data: { isPublished, publishedAt: isPublished ? new Date() : null },
    });
    revalidateBlog();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
