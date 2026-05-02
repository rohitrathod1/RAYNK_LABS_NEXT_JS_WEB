import { db } from "@/lib/db";
import type { SeoFormSchema } from "../validations";

export async function upsertSeo(data: SeoFormSchema) {
  return db.seoPage.upsert({
    where: { page: data.page },
    create: data,
    update: {
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords,
      ogImage: data.ogImage,
      canonicalUrl: data.canonicalUrl,
      isIndexed: data.isIndexed,
      updatedAt: new Date(),
    },
  });
}

export async function deleteSeo(page: string) {
  return db.seoPage.delete({ where: { page } });
}
