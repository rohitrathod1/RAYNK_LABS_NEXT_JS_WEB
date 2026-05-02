import { z } from "zod";

export const navLinkSchema = z.object({
  title: z.string().min(1, "Title required"),
  href: z.string().min(1, "Link required"),
  parentId: z.string().nullable().optional(),
  isVisible: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const navLinkUpdateSchema = navLinkSchema.partial().extend({
  id: z.string().min(1, "ID required"),
});

export const navLinkDeleteSchema = z.object({
  id: z.string().min(1, "ID required"),
});

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number().int(),
      parentId: z.string().nullable().optional(),
    })
  ),
});

export type NavLinkSchema = z.infer<typeof navLinkSchema>;
export type NavLinkUpdateSchema = z.infer<typeof navLinkUpdateSchema>;
export type NavLinkDeleteSchema = z.infer<typeof navLinkDeleteSchema>;
export type ReorderSchema = z.infer<typeof reorderSchema>;
