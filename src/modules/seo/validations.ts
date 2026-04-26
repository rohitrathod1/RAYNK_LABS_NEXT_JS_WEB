import { z } from "zod";

export const robotsSchema = z.enum([
  "index,follow",
  "noindex,follow",
  "index,nofollow",
  "noindex,nofollow",
]);

export const twitterCardSchema = z.enum(["summary", "summary_large_image"]);

export const seoFormSchema = z.object({
  title: z.string().min(1, "Meta title is required").max(70, "Keep under 70 characters"),
  description: z.string().max(180, "Keep under 180 characters").optional().default(""),
  keywords: z.string().optional().default(""),
  ogTitle: z.string().max(95).optional().default(""),
  ogDescription: z.string().max(200).optional().default(""),
  ogImage: z.string().optional().default(""),
  twitterCard: twitterCardSchema.default("summary_large_image"),
  canonicalUrl: z.string().optional().default(""),
  robots: robotsSchema.default("index,follow"),
});

export const seoPageKeySchema = z.object({
  page: z
    .string()
    .min(1, "Page key is required")
    .max(120)
    .regex(/^[a-z0-9:_/\-]+$/, "Lowercase letters, numbers, hyphens and / : _ only"),
});

export type SeoFormSchema = z.infer<typeof seoFormSchema>;
