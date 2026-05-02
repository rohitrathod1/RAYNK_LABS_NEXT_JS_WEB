import { db } from "@/lib/db";
import type { NavLinkSchema, NavLinkUpdateSchema, ReorderSchema } from "../validations";

export async function createNavLink(data: NavLinkSchema) {
  return db.navLink.create({
    data: {
      title: data.title,
      href: data.href,
      parentId: data.parentId || null,
      isVisible: data.isVisible ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateNavLink(data: NavLinkUpdateSchema) {
  const { id, ...rest } = data;
  return db.navLink.update({
    where: { id },
    data: {
      ...(rest.title !== undefined && { title: rest.title }),
      ...(rest.href !== undefined && { href: rest.href }),
      ...(rest.parentId !== undefined && { parentId: rest.parentId || null }),
      ...(rest.isVisible !== undefined && { isVisible: rest.isVisible }),
      ...(rest.sortOrder !== undefined && { sortOrder: rest.sortOrder }),
    },
  });
}

export async function deleteNavLink(id: string) {
  // Delete children first
  await db.navLink.deleteMany({ where: { parentId: id } });
  return db.navLink.delete({ where: { id } });
}

export async function reorderNavLinks(data: ReorderSchema) {
  const updates = data.items.map((item) =>
    db.navLink.update({
      where: { id: item.id },
      data: {
        sortOrder: item.sortOrder,
        ...(item.parentId !== undefined && { parentId: item.parentId || null }),
      },
    })
  );
  return Promise.all(updates);
}
