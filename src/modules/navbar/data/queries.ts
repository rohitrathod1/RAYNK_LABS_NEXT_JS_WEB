import { db } from "@/lib/db";

export async function getNavLinks() {
  return db.navLink.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    include: {
      subLinks: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getAllNavLinks() {
  return db.navLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      subLinks: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getNavLinkById(id: string) {
  return db.navLink.findUnique({
    where: { id },
    include: { subLinks: { orderBy: { sortOrder: "asc" } } },
  });
}
