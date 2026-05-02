import { z } from "zod";

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
