// Zod schemas for this module.
// Re-use these schemas in both server actions and API route handlers.

import { z } from "zod";

export const createTemplateSchema = z.object({
  // Define validation rules here
});

export const updateTemplateSchema = createTemplateSchema.partial().extend({
  id: z.string().cuid(),
});

export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateSchema = z.infer<typeof updateTemplateSchema>;
