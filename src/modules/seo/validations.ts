import { z } from "zod";

export const robotsSchema = z.enum([
  "index,follow",
  "noindex,follow",
  "index,nofollow",
  "noindex,nofollow",
]);

export const twitterCardSchema = z.enum(["summary", "summary_large_image"]);

export const seoFormSchema = z.object({
  page: z
    .string()
    .min(1, "Page is required")
    .max(120)
    .regex(/^[a-z0-9:_/\-]+$/, "Lowercase letters, numbers, hyphens and / : _ only"),
  metaTitle: z.string().min(1, "Meta title is required").max(70, "Keep under 70 characters"),
  metaDescription: z.string().min(1, "Meta description is required").max(180, "Keep under 180 characters"),
  keywords: z.union([z.string(), z.array(z.string())]).default(""),
  ogImage: z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
}).transform((data) => ({
  ...data,
  keywords: Array.isArray(data.keywords)
    ? data.keywords.map((keyword) => keyword.trim()).filter(Boolean)
    : data.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
}));

export const seoPageKeySchema = z.object({
  page: z
    .string()
    .min(1, "Page key is required")
    .max(120)
    .regex(/^[a-z0-9:_/\-]+$/, "Lowercase letters, numbers, hyphens and / : _ only"),
});

export type SeoFormSchema = z.infer<typeof seoFormSchema>;
