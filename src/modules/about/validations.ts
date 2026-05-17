import { z } from "zod";

export const ABOUT_INQUIRY_TYPES = [
  "Work With Us",
  "Join Team",
  "Feedback",
  "Partnership",
  "Project Inquiry",
] as const;

export const heroSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().min(1, "Subtitle required"),
  backgroundImage: z.string().optional().default(""),
});

export const storySchema = z.object({
  image: z.string().optional().default(""),
  content: z.string().min(1, "Content required"),
});

export const missionItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

export const missionSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  items: z.array(missionItemSchema).optional().default([]),
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

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  image: z.string().optional().default(""),
  bio: z.string().optional().default(""),
  skills: z.array(z.string().min(1)).optional().default([]),
  githubUrl: z.string().optional().default(""),
  linkedinUrl: z.string().optional().default(""),
  twitterUrl: z.string().optional().default(""),
  portfolioUrl: z.string().optional().default(""),
});

export const coreTeamSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  members: z.array(teamMemberSchema).optional().default([]),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().min(1),
  icon: z.string().min(1),
});

export const socialLinksSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().optional().default(""),
  links: z.array(socialLinkSchema).optional().default([]),
});

export const collaborationHighlightSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const collaborationCtaSchema = z.object({
  title: z.string().min(1, "Title required"),
  subtitle: z.string().min(1, "Subtitle required"),
  submitText: z.string().min(1, "Submit text required"),
  successMessage: z.string().min(1, "Success message required"),
  highlights: z.array(collaborationHighlightSchema).min(1).max(4),
});

export const aboutInquirySchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  companyName: z.string().trim().max(160).optional().or(z.literal("")),
  inquiryType: z.enum(ABOUT_INQUIRY_TYPES),
  message: z.string().trim().min(20, "Please share a few more details").max(2500),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

export type HeroSchema = z.infer<typeof heroSchema>;
export type StorySchema = z.infer<typeof storySchema>;
export type MissionSchema = z.infer<typeof missionSchema>;
export type WhyChooseSchema = z.infer<typeof whyChooseSchema>;
export type CoreTeamSchema = z.infer<typeof coreTeamSchema>;
export type SocialLinksSchema = z.infer<typeof socialLinksSchema>;
export type CollaborationCtaSchema = z.infer<typeof collaborationCtaSchema>;
export type AboutInquirySchema = z.infer<typeof aboutInquirySchema>;
