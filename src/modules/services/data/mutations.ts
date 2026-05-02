import { db } from "@/lib/db";

export async function upsertServicesSection(section: string, content: unknown) {
  return db.servicesPage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}
