import { z } from "zod";

export const heroSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().min(1, "Subtitle required"),
  backgroundImage: z.string().optional().default(""),
});

export const contactInfoItemSchema = z.object({
  icon: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
});

export const contactInfoSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  items: z.array(contactInfoItemSchema).optional().default([]),
  workingHours: z.string().optional().default(""),
});

export const contactFormSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  submitText: z.string().optional().default("Send Message"),
});

export const mapSchema = z.object({
  title: z.string().min(1, "Title required"),
  embedUrl: z.string().optional().default(""),
});

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const faqSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  items: z.array(faqItemSchema).optional().default([]),
});

export const ctaSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  buttonText: z.string().min(1, "Button text required"),
  buttonLink: z.string().min(1, "Button link required"),
});

export const contactInquirySchema = z.object({
  name: z.string().trim().min(2, "Full name required").max(120),
  email: z.string().trim().email("Valid email required").max(160),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(160).optional().default(""),
  serviceType: z.string().trim().max(120).optional().default(""),
  subject: z.string().trim().max(180).optional().default(""),
  budgetRange: z.string().trim().max(120).optional().default(""),
  projectTimeline: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(20, "Message should be at least 20 characters").max(2500),
  website: z.string().trim().max(0).optional().default(""),
});

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

export type HeroSchema = z.infer<typeof heroSchema>;
export type ContactInfoSchema = z.infer<typeof contactInfoSchema>;
export type ContactFormSchema = z.infer<typeof contactFormSchema>;
export type MapSchema = z.infer<typeof mapSchema>;
export type FaqSchema = z.infer<typeof faqSchema>;
export type CtaSchema = z.infer<typeof ctaSchema>;
export type ContactInquirySchema = z.infer<typeof contactInquirySchema>;
