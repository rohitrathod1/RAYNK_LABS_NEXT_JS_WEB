import { db } from '@/lib/db';
import { Prisma, type SeoMeta } from '@prisma/client';

export async function upsertSeoMeta(
  page: string,
  data: Prisma.SeoMetaUncheckedCreateInput,
): Promise<SeoMeta> {
  // Strip `page` from update — keying is enforced by the unique constraint.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page: _ignored, ...updateData } = data;
  return db.seoMeta.upsert({
    where: { page },
    create: { ...data, page },
    update: updateData,
  });
}

export async function deleteSeoMeta(page: string): Promise<SeoMeta> {
  return db.seoMeta.delete({ where: { page } });
}

export async function upsertLegacyPageSeo(
  page: string,
  data: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    noIndex?: boolean;
  },
): Promise<SeoMeta> {
  const metaTitle = data.title?.trim() || page;
  const metaDescription = data.description?.trim() || null;
  const keywords = data.keywords
    ? data.keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
    : [];

  return upsertSeoMeta(page, {
    page,
    metaTitle,
    metaDescription,
    keywords,
    ogTitle: metaTitle,
    ogDescription: metaDescription,
    ogImage: data.ogImage?.trim() || null,
    twitterCard: 'summary_large_image',
    canonicalUrl: null,
    structuredData: Prisma.JsonNull,
    robots: data.noIndex ? 'noindex,nofollow' : 'index,follow',
  });
}
