// Module-specific TypeScript types.
// Keep types local to this module. Share only via explicit re-export if another module needs them.

export interface TemplateItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTemplateInput {
  // Define input fields here
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  id: string;
}
