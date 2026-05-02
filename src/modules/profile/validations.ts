import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name required").optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
});

export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
