import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { db } from "@/lib/db";
import {
  blogHeroSchema,
  blogListSchema,
  blogPostSchema,
} from "@/modules/blog/validations";
import type { ZodSchema } from "zod";

const SECTION_SCHEMAS: Record<string, ZodSchema> = {
  hero: blogHeroSchema,
  blog_list: blogListSchema,
};

export async function GET() {
  try {
    await requirePermission("MANAGE_BLOG");
    const sections = await db.blogPage.findMany({ orderBy: { sortOrder: "asc" } });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;

    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: { sections: data, posts } });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_BLOG");
    const body = (await req.json()) as Record<string, unknown>;

    if (body.section && SECTION_SCHEMAS[body.section as string]) {
      const schema = SECTION_SCHEMAS[body.section as string];
      const validated = schema.parse(body.content);
      const result = await db.blogPage.upsert({
        where: { section: body.section as string },
        update: { content: validated as never, updatedAt: new Date() },
        create: { section: body.section as string, content: validated as never },
      });
      return NextResponse.json({ success: true, data: result });
    }

    const validated = blogPostSchema.parse(body);
    const tagsArray = validated.tags
      ? validated.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const post = await db.blogPost.create({
      data: {
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
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requirePermission("MANAGE_BLOG");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Post ID required" }, { status: 400 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const validated = blogPostSchema.parse(body);
    const tagsArray = validated.tags
      ? validated.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const post = await db.blogPost.update({
      where: { id },
      data: {
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
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requirePermission("MANAGE_BLOG");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Post ID required" }, { status: 400 });
    }

    await db.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
