import { z } from "zod";

export const heroSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().min(1, "Subtitle required"),
  backgroundImage: z.string().optional().default(""),
});

export const introSchema = z.object({
  description: z.string().min(1, "Description required"),
});

export const founderSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  image: z.string().optional().default(""),
  bio: z.string().optional().default(""),
  portfolioUrl: z.string().optional().default(""),
});

export const foundersSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  founders: z.array(founderSchema).optional().default([]),
});

export const teamMembersSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
});

export const valuePointSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const valuesSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  points: z.array(valuePointSchema).optional().default([]),
});

export const ctaSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  buttonText: z.string().min(1, "Button text required"),
  buttonLink: z.string().min(1, "Button link required"),
});

export const teamMemberInputSchema = z.object({
  name: z.string().min(1, "Name required"),
  role: z.string().min(1, "Role required"),
  bio: z.string().optional().default(""),
  image: z.string().min(1, "Image required"),
  linkedin: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  github: z.string().optional().default(""),
  portfolio: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
});

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

export type HeroSchema = z.infer<typeof heroSchema>;
export type IntroSchema = z.infer<typeof introSchema>;
export type FoundersSchema = z.infer<typeof foundersSchema>;
export type TeamMembersSchema = z.infer<typeof teamMembersSchema>;
export type ValuesSchema = z.infer<typeof valuesSchema>;
export type CtaSchema = z.infer<typeof ctaSchema>;
export type TeamMemberInputSchema = z.infer<typeof teamMemberInputSchema>;
