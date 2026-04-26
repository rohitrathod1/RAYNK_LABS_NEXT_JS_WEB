import { db } from "@/lib/db";
import type { SeoFormSchema } from "../validations";

export async function upsertSeo(page: string, data: SeoFormSchema) {
  const noIndex = data.robots.includes("noindex");
  const payload = { ...data, noIndex };
  return db.seo.upsert({
    where: { page },
    create: { page, ...payload },
    update: { ...payload, updatedAt: new Date() },
  });
}

export async function deleteSeo(page: string) {
  return db.seo.delete({ where: { page } });
}
