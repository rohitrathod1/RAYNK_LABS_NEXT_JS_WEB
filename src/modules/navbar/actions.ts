"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import { navLinkSchema, navLinkUpdateSchema, navLinkDeleteSchema, reorderSchema } from "./validations";
import { createNavLink, updateNavLink, deleteNavLink, reorderNavLinks } from "./data";

function revalidateNavbar() {
  revalidatePath("/");
  revalidatePath("/admin/dashboard/navbar");
}

export async function createNavLinkAction(raw: unknown) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const data = navLinkSchema.parse(raw);
    await createNavLink(data);
    revalidateNavbar();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateNavLinkAction(raw: unknown) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const data = navLinkUpdateSchema.parse(raw);
    await updateNavLink(data);
    revalidateNavbar();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function deleteNavLinkAction(id: string) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    navLinkDeleteSchema.parse({ id });
    await deleteNavLink(id);
    revalidateNavbar();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function reorderNavLinksAction(raw: unknown) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const data = reorderSchema.parse(raw);
    await reorderNavLinks(data);
    revalidateNavbar();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function getPublicNavLinks() {
  return db.navLink.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  }).then((links) => {
    const parents = links.filter((l) => !l.parentId);
    const children = links.filter((l) => l.parentId);
    return parents.map((parent) => ({
      ...parent,
      children: children
        .filter((c) => c.parentId === parent.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  });
}
