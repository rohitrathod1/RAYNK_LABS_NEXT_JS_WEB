"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import {
  footerSectionSchema,
  footerLinkSchema,
  footerSettingsSchema,
} from "./validations";
import {
  upsertFooterSettings,
  createFooterSection,
  updateFooterSection,
  deleteFooterSection,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
} from "./data/mutations";

function revalidateFooter() {
  revalidatePath("/");
  revalidatePath("/admin/footer");
  revalidatePath("/admin/dashboard/footer");
}

export async function updateFooterSettings(raw: unknown) {
  try {
    await requirePermission("MANAGE_FOOTER");
    const data = footerSettingsSchema.parse(raw);
    await upsertFooterSettings(data);
    revalidateFooter();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function addFooterSection(raw: unknown) {
  try {
    await requirePermission("MANAGE_FOOTER");
    const data = footerSectionSchema.parse(raw);
    await createFooterSection(data);
    revalidateFooter();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function editFooterSection(id: string, raw: unknown) {
  try {
    await requirePermission("MANAGE_FOOTER");
    const data = footerSectionSchema.parse(raw);
    await updateFooterSection(id, data);
    revalidateFooter();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function removeFooterSection(id: string) {
  try {
    await requirePermission("MANAGE_FOOTER");
    await deleteFooterSection(id);
    revalidateFooter();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function addFooterLink(raw: unknown) {
  try {
    await requirePermission("MANAGE_FOOTER");
    const data = footerLinkSchema.parse(raw);
    await createFooterLink(data);
    revalidateFooter();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function editFooterLink(id: string, raw: unknown) {
  try {
    await requirePermission("MANAGE_FOOTER");
    const data = footerLinkSchema.parse(raw);
    await updateFooterLink(id, data);
    revalidateFooter();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function removeFooterLink(id: string) {
  try {
    await requirePermission("MANAGE_FOOTER");
    await deleteFooterLink(id);
    revalidateFooter();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
