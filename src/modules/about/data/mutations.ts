import { db } from "@/lib/db";

export async function upsertAboutSection(section: string, content: unknown) {
  return db.aboutPage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}
