"use server";

// Server Actions for this module — the ONLY write path from the client.
// Every action must: validate input → guard auth → call mutation → return ActionResponse.

import { requireAdmin } from "@/lib/require-admin";
import { ok, fail } from "@/lib/action-response";
import { createTemplateSchema, updateTemplateSchema } from "./validations";
import { createTemplateItem, updateTemplateItem, deleteTemplateItem } from "./data/mutations";
import { getErrorMessage } from "@/lib/errors";

export async function createTemplateAction(raw: unknown) {
  try {
    await requireAdmin();
    const data = createTemplateSchema.parse(raw);
    const item = await createTemplateItem(data);
    return ok(item);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateTemplateAction(raw: unknown) {
  try {
    await requireAdmin();
    const data = updateTemplateSchema.parse(raw);
    const item = await updateTemplateItem(data);
    return ok(item);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function deleteTemplateAction(id: string) {
  try {
    await requireAdmin();
    await deleteTemplateItem(id);
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
