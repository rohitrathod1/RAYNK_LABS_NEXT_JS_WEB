import { z } from "zod";

export const heroSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().min(1, "Subtitle required"),
  backgroundImage: z.string().optional().default(""),
});

export const categoriesFilterSchema = z.object({
  title: z.string().optional().default(""),
  categories: z.array(z.string().min(1)).optional().default([]),
});

export const projectsGridSchema = z.object({
  title: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
});

export const testimonialItemSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: z.string().optional().default(""),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5).optional().default(5),
});

export const testimonialsSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  testimonials: z.array(testimonialItemSchema).optional().default([]),
});

export const ctaSchema = z.object({
  heading: z.string().min(1, "Heading required"),
  subheading: z.string().optional().default(""),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().optional().default(""),
  category: z.string().min(1, "Category required"),
  image: z.string().optional().default(""),
  liveUrl: z.string().url().optional().or(z.literal("")).default(""),
  githubUrl: z.string().url().optional().or(z.literal("")).default(""),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const seoSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

export type HeroSchema = z.infer<typeof heroSchema>;
export type CategoriesFilterSchema = z.infer<typeof categoriesFilterSchema>;
export type ProjectsGridSchema = z.infer<typeof projectsGridSchema>;
export type TestimonialsSchema = z.infer<typeof testimonialsSchema>;
export type CtaSchema = z.infer<typeof ctaSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;
