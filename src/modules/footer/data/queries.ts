import { db } from "@/lib/db";

export async function getFooterData() {
  const [sections, settings] = await Promise.all([
    db.footerSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { links: { orderBy: { sortOrder: "asc" } } },
    }),
    db.footerSettings.findFirst(),
  ]);

  return { sections, settings };
}

export async function getAllFooterSections() {
  return db.footerSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { links: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getFooterSettings() {
  return db.footerSettings.findFirst();
}
