// Module-specific TypeScript types.
// Keep types local to this module. Share only via explicit re-export if another module needs them.

export interface TemplateItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTemplateInput = object;

export type UpdateTemplateInput = Partial<CreateTemplateInput> & {
  id: string;
};
