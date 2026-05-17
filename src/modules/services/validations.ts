import { z } from "zod";
import { SERVICE_BUDGET_RANGES, SERVICE_PROJECT_TIMELINES } from "./constants";

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
  ctaText: z.string().optional().default("Get Service"),
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
  secondaryCtaText: z.string().min(1),
  secondaryCtaHref: z.string().min(1),
  primaryService: z.string().min(1),
  secondaryService: z.string().min(1),
  trustIndicators: z.array(z.string().min(1)).min(1).max(4),
});

export const serviceInquirySchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  contactNumber: z.string().trim().min(7, "Contact number is required").max(40),
  companyName: z.string().trim().max(160).optional().or(z.literal("")),
  serviceName: z.string().trim().min(1, "Service name is required").max(160),
  budgetRange: z.enum(SERVICE_BUDGET_RANGES),
  projectTimeline: z.enum(SERVICE_PROJECT_TIMELINES),
  projectDescription: z.string().trim().min(20, "Please share more project details").max(2500),
  website: z.string().max(0).optional().or(z.literal("")),
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
export type ServiceInquirySchema = z.infer<typeof serviceInquirySchema>;
