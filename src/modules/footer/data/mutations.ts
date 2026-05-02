import { db } from "@/lib/db";

export async function upsertFooterSettings(data: unknown) {
  const existing = await db.footerSettings.findFirst();
  
  if (existing) {
    return db.footerSettings.update({
      where: { id: existing.id },
      data: data as never,
    });
  }
  
  return db.footerSettings.create({
    data: data as never,
  });
}

export async function createFooterSection(data: unknown) {
  return db.footerSection.create({
    data: data as never,
    include: { links: true },
  });
}

export async function updateFooterSection(id: string, data: unknown) {
  return db.footerSection.update({
    where: { id },
    data: data as never,
    include: { links: true },
  });
}

export async function deleteFooterSection(id: string) {
  return db.footerSection.delete({
    where: { id },
  });
}

export async function createFooterLink(data: unknown) {
  return db.footerLink.create({
    data: data as never,
  });
}

export async function updateFooterLink(id: string, data: unknown) {
  return db.footerLink.update({
    where: { id },
    data: data as never,
  });
}

export async function deleteFooterLink(id: string) {
  return db.footerLink.delete({
    where: { id },
  });
}
