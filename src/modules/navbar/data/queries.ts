import { db } from "@/lib/db";

export async function getNavLinks() {
  const links = await db.navLink.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });

  // Build tree: parent -> children
  const parents = links.filter((l) => !l.parentId);
  const children = links.filter((l) => l.parentId);

  return parents.map((parent) => ({
    ...parent,
    children: children
      .filter((c) => c.parentId === parent.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

export async function getAllNavLinks() {
  const links = await db.navLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const parents = links.filter((l) => !l.parentId);
  const children = links.filter((l) => l.parentId);

  return parents.map((parent) => ({
    ...parent,
    children: children
      .filter((c) => c.parentId === parent.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

export async function getNavLinkById(id: string) {
  return db.navLink.findUnique({ where: { id } });
}
