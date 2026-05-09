'use server';

import { revalidatePath } from 'next/cache';
import type { ActionResponse } from '@/lib/action-response';
import { requirePermission } from '@/middleware/permission';
import { Prisma, type SeoMeta } from '@prisma/client';
import { seoFormSchema } from './validations';
import { getSeoByPage, getAllSeo } from './data/queries';
import { upsertSeoMeta, deleteSeoMeta } from './data/mutations';
import { getSeoPublicPath, isValidSeoPageKey, normalizeSeoPageKey } from './page-config';

async function requireSeoAccess<T>(): Promise<ActionResponse<T> | null> {
  try {
    await requirePermission('MANAGE_SEO');
    return null;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unauthorized',
    };
  }
}

export async function getSeoMetaAction(page: string): Promise<ActionResponse<SeoMeta | null>> {
  const pageKey = normalizeSeoPageKey(page);
  if (!isValidSeoPageKey(pageKey)) return { success: false, error: 'Invalid SEO page key' };
  const data = await getSeoByPage(pageKey);
  return { success: true, data };
}

export async function listAllSeoAction(): Promise<ActionResponse<SeoMeta[]>> {
  const guard = await requireSeoAccess<SeoMeta[]>();
  if (guard) return guard;
  const data = await getAllSeo();
  return { success: true, data };
}

/**
 * Save (upsert) a page's SEO. Runs Zod validation, then writes to DB,
 * then revalidates both the public page and the admin overview.
 */
export async function updateSeoMetaAction(
  page: string,
  input: unknown,
): Promise<ActionResponse<SeoMeta>> {
  const guard = await requireSeoAccess<SeoMeta>();
  if (guard) return guard;
  const pageKey = normalizeSeoPageKey(page);
  if (!isValidSeoPageKey(pageKey)) return { success: false, error: 'Invalid SEO page key' };

  const parsed = seoFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const record = await upsertSeoMeta(pageKey, {
    page: pageKey,
    metaTitle: parsed.data.metaTitle,
    metaDescription: parsed.data.metaDescription,
    keywords: parsed.data.keywords,
    ogTitle: parsed.data.ogTitle,
    ogDescription: parsed.data.ogDescription,
    ogImage: parsed.data.ogImage,
    twitterCard: parsed.data.twitterCard,
    canonicalUrl: parsed.data.canonicalUrl,
    structuredData:
      parsed.data.structuredData === null
        ? Prisma.JsonNull
        : (parsed.data.structuredData as Prisma.InputJsonValue),
    robots: parsed.data.robots,
  });

  // Best-effort revalidation of the affected route. `page` is a slug like
  // "home", "about", "products" — map to its public path.
  revalidatePath(getSeoPublicPath(pageKey));
  revalidatePath('/admin/seo');

  return { success: true, data: record };
}

export async function deleteSeoMetaAction(page: string): Promise<ActionResponse<SeoMeta>> {
  const guard = await requireSeoAccess<SeoMeta>();
  if (guard) return guard;
  const pageKey = normalizeSeoPageKey(page);
  if (!isValidSeoPageKey(pageKey)) return { success: false, error: 'Invalid SEO page key' };
  const data = await deleteSeoMeta(pageKey);
  revalidatePath('/admin/seo');
  return { success: true, data };
}
