import { z } from 'zod';

export const navLinkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(60, 'Title too long'),
  href: z.string().trim().min(1, 'Path / URL is required').max(300, 'Path too long'),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  hasDropdown: z.boolean().default(false),
  openInNewTab: z.boolean().default(false),
});

export const navLinkUpdateSchema = z.object({
  title: z.string().min(1).max(60).optional(),
  href: z.string().trim().min(1).max(300).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
  hasDropdown: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
});

export type NavLinkSchemaInput = z.infer<typeof navLinkSchema>;
export type NavLinkUpdateSchemaInput = z.infer<typeof navLinkUpdateSchema>;

// ── Sub-link schemas ──────────────────────────────────────────

export const navSubLinkSchema = z.object({
  navLinkId: z.string().min(1, 'Parent link is required'),
  title: z.string().min(1, 'Title is required').max(120, 'Title too long'),
  href: z.string().min(1, 'Link is required').max(300, 'Link too long'),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

export const navSubLinkUpdateSchema = z.object({
  navLinkId: z.string().min(1).optional(),
  title: z.string().min(1).max(120).optional(),
  href: z.string().min(1).max(300).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
});

export type NavSubLinkSchemaInput = z.infer<typeof navSubLinkSchema>;
export type NavSubLinkUpdateSchemaInput = z.infer<typeof navSubLinkUpdateSchema>;

// ── Navbar settings (logo + branding) ─────────────────────────

export const navbarSettingSchema = z.object({
  logoUrl: z.string().max(500).nullable().optional(),
  logoAlt: z.string().max(200).nullable().optional(),
});

export type NavbarSettingSchemaInput = z.infer<typeof navbarSettingSchema>;
