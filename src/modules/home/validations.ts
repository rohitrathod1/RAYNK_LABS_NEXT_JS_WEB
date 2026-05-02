import { z } from "zod";

export const heroSchema = z.object({
  heading: z.string().min(1, "Heading required"),
  subtitle: z.string().min(1, "Subtitle required"),
  ctaPrimaryText: z.string().min(1, "Primary CTA text required"),
  ctaPrimaryHref: z.string().min(1, "Primary CTA link required"),
  ctaSecondaryText: z.string().optional().default(""),
  ctaSecondaryHref: z.string().optional().default(""),
  backgroundImage: z.string().optional().default(""),
});

export const initiativeCardSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const initiativesSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  cards: z.array(initiativeCardSchema).optional().default([]),
});

export const serviceCardSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const servicesSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  services: z.array(serviceCardSchema).optional().default([]),
});

export const whyDigitalSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  image: z.string().optional().default(""),
  bulletPoints: z.array(z.string().min(1)).optional().default([]),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional().default(""),
  href: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
});

export const portfolioSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  items: z.array(portfolioItemSchema).optional().default([]),
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

export const whyChoosePointSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const whyChooseSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  points: z.array(whyChoosePointSchema).optional().default([]),
});

export const ctaSchema = z.object({
  heading: z.string().min(1, "Heading required"),
  subheading: z.string().optional().default(""),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
});

export const seoSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

export type HeroSchema = z.infer<typeof heroSchema>;
export type InitiativesSchema = z.infer<typeof initiativesSchema>;
export type ServicesSchema = z.infer<typeof servicesSchema>;
export type WhyDigitalSchema = z.infer<typeof whyDigitalSchema>;
export type PortfolioSchema = z.infer<typeof portfolioSchema>;
export type TestimonialsSchema = z.infer<typeof testimonialsSchema>;
export type WhyChooseSchema = z.infer<typeof whyChooseSchema>;
export type CtaSchema = z.infer<typeof ctaSchema>;
