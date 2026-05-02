import { z } from "zod";

export const blogHeroSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().min(1, "Subtitle required"),
  backgroundImage: z.string().optional().default(""),
});

export const blogListSchema = z.object({
  title: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional().default(""),
  content: z.string().min(1, "Content required"),
  coverImage: z.string().optional().default(""),
  author: z.string().min(1, "Author required"),
  tags: z.string().optional().default(""),
  isPublished: z.boolean().optional().default(false),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
});

export const seoSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

export type BlogHeroSchema = z.infer<typeof blogHeroSchema>;
export type BlogListSchema = z.infer<typeof blogListSchema>;
export type BlogPostSchema = z.infer<typeof blogPostSchema>;
