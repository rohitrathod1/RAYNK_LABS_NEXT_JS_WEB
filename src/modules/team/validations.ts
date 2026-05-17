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
  displayName: z.string().min(1, "Name required"),
  role: z.string().optional(),
  bio: z.string().optional().default(""),
  avatar: z.string().optional().default(""),
  githubUrl: z.string().optional().default(""),
  linkedinUrl: z.string().optional().default(""),
  instagramUrl: z.string().optional().default(""),
  youtubeUrl: z.string().optional().default(""),
  isVisible: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

export const teamApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z.string().trim().min(8, "Phone number is required").max(40),
  roleInterestedIn: z.string().trim().min(2, "Role is required").max(120),
  experienceLevel: z.string().trim().min(2, "Experience level is required").max(80),
  portfolioUrl: z.string().trim().url("Enter a valid portfolio URL").max(200).optional().or(z.literal("")),
  resumeUrl: z.string().trim().min(1, "Resume upload is required").max(220),
  message: z.string().trim().min(20, "Please share a short introduction").max(2500),
});

export type HeroSchema = z.infer<typeof heroSchema>;
export type IntroSchema = z.infer<typeof introSchema>;
export type FoundersSchema = z.infer<typeof foundersSchema>;
export type TeamMembersSchema = z.infer<typeof teamMembersSchema>;
export type ValuesSchema = z.infer<typeof valuesSchema>;
export type CtaSchema = z.infer<typeof ctaSchema>;
export type TeamMemberInputSchema = z.infer<typeof teamMemberInputSchema>;
export type TeamApplicationSchema = z.infer<typeof teamApplicationSchema>;
