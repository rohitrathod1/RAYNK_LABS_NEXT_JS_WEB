import { z } from "zod";

export const heroSchema = z.object({
  heading: z.string().min(1, "Heading required"),
  subheading: z.string().min(1, "Subheading required"),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
  secondaryCtaText: z.string().optional().default(""),
  secondaryCtaHref: z.string().optional().default(""),
  backgroundImage: z.string().optional().default(""),
  badgeText: z.string().optional().default(""),
});

export const missionSchema = z.object({
  title: z.string().min(1, "Title required"),
  body: z.string().min(1, "Body required"),
  image: z.string().optional().default(""),
  stats: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .optional()
    .default([]),
});

export const featuredProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional().default(""),
  href: z.string().optional().default(""),
  badge: z.string().optional().default(""),
});

export const featuredProductsSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  products: z.array(featuredProductSchema).optional().default([]),
});

export const healthBenefitSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional().default(""),
});

export const healthBenefitsSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  benefits: z.array(healthBenefitSchema).optional().default([]),
});

export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: z.string().optional().default(""),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5).optional().default(5),
});

export const testimonialsSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  testimonials: z.array(testimonialSchema).optional().default([]),
});

export const ctaSchema = z.object({
  heading: z.string().min(1, "Heading required"),
  subheading: z.string().optional().default(""),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
  backgroundImage: z.string().optional().default(""),
});

export const seoSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

export type HeroSchema = z.infer<typeof heroSchema>;
export type MissionSchema = z.infer<typeof missionSchema>;
export type FeaturedProductsSchema = z.infer<typeof featuredProductsSchema>;
export type HealthBenefitsSchema = z.infer<typeof healthBenefitsSchema>;
export type TestimonialsSchema = z.infer<typeof testimonialsSchema>;
export type CtaSchema = z.infer<typeof ctaSchema>;
