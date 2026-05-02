import { z } from "zod";

export const footerSectionSchema = z.object({
  title: z.string().min(1, "Title required"),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const footerLinkSchema = z.object({
  label: z.string().min(1, "Label required"),
  href: z.string().min(1, "Link required"),
  sectionId: z.string().min(1, "Section required"),
  sortOrder: z.number().optional().default(0),
});

export const footerSettingsSchema = z.object({
  logo: z.string().optional().default(""),
  description: z.string().optional().default(""),
  address: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().default(""),
  copyright: z.string().optional().default(""),
});

export type FooterSectionSchema = z.infer<typeof footerSectionSchema>;
export type FooterLinkSchema = z.infer<typeof footerLinkSchema>;
export type FooterSettingsSchema = z.infer<typeof footerSettingsSchema>;
