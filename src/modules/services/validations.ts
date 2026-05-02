import { z } from "zod";

export const serviceHeroSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  backgroundImage: z.string().optional().default(""),
});

export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
});

export const serviceCardSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  ctaText: z.string().optional().default("Learn More"),
  ctaHref: z.string().optional().default("/contact"),
});

export const servicesListSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  services: z.array(serviceCardSchema).optional().default([]),
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

export const processStepSchema = z.object({
  step: z.number().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

export const processSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  steps: z.array(processStepSchema).optional().default([]),
});

export const contactCtaSchema = z.object({
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

export type ServiceHeroSchema = z.infer<typeof serviceHeroSchema>;
export type CategorySchema = z.infer<typeof categorySchema>;
export type ServiceCardSchema = z.infer<typeof serviceCardSchema>;
export type ServicesListSchema = z.infer<typeof servicesListSchema>;
export type WhyChoosePointSchema = z.infer<typeof whyChoosePointSchema>;
export type WhyChooseSchema = z.infer<typeof whyChooseSchema>;
export type ProcessStepSchema = z.infer<typeof processStepSchema>;
export type ProcessSchema = z.infer<typeof processSchema>;
export type ContactCtaSchema = z.infer<typeof contactCtaSchema>;
