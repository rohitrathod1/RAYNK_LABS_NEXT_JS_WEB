import { db } from "@/lib/db";

export async function upsertHomeSection(section: string, content: unknown) {
  return db.homePage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}
