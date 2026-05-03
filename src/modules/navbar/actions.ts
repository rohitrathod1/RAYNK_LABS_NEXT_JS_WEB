'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { ok, fail, type ActionResponse } from '@/lib/action-response';
import { revalidatePath } from 'next/cache';
import {
  navLinkSchema,
  navLinkUpdateSchema,
  navSubLinkSchema,
  navSubLinkUpdateSchema,
  navbarSettingSchema,
} from './validations';

const SETTING_ID = 'default';

type NavLinkWithSubs = Awaited<ReturnType<typeof getAllNavLinks>>[number];
type NavbarSettingRecord = Awaited<ReturnType<typeof getNavbarSetting>>;

async function requireAdmin<T>(): Promise<ActionResponse<T> | null> {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role ?? '')) {
    return fail('Unauthorized');
  }
  return null;
}

export async function getVisibleNavLinks() {
  return db.navLink.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      subLinks: {
        where: { isVisible: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function getAllNavLinks() {
  return db.navLink.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      subLinks: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function getNavLink(id: string): Promise<ActionResponse<NavLinkWithSubs>> {
  const link = await db.navLink.findUnique({
    where: { id },
    include: { subLinks: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!link) return fail('Nav link not found');
  return ok(link);
}

export async function createNavLink(input: unknown): Promise<ActionResponse<any>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = navLinkSchema.safeParse(input);
  if (!parsed.success) {
    return fail('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const created = await db.navLink.create({
    data: {
      ...parsed.data,
      href: parsed.data.href ?? '',
    },
  });

  revalidatePath('/', 'layout');
  revalidatePath('/');
  return ok(created);
}

export async function updateNavLink(id: string, input: unknown): Promise<ActionResponse<any>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const existing = await db.navLink.findUnique({ where: { id } });
  if (!existing) return fail('Nav link not found');

  const parsed = navLinkUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return fail('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const updated = await db.navLink.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/', 'layout');
  revalidatePath('/');
  return ok(updated);
}

export async function deleteNavLink(id: string): Promise<ActionResponse<any>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const existing = await db.navLink.findUnique({ where: { id } });
  if (!existing) return fail('Nav link not found');

  const deleted = await db.navLink.delete({ where: { id } });

  revalidatePath('/', 'layout');
  revalidatePath('/');
  return ok(deleted);
}

export async function createNavSubLink(input: unknown): Promise<ActionResponse<any>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = navSubLinkSchema.safeParse(input);
  if (!parsed.success) {
    return fail('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const parent = await db.navLink.findUnique({ where: { id: parsed.data.navLinkId } });
  if (!parent) return fail('Parent nav link not found');

  const created = await db.navSubLink.create({ data: parsed.data });

  revalidatePath('/', 'layout');
  revalidatePath('/');
  return ok(created);
}

export async function updateNavSubLink(id: string, input: unknown): Promise<ActionResponse<any>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const existing = await db.navSubLink.findUnique({ where: { id } });
  if (!existing) return fail('Sub-link not found');

  const parsed = navSubLinkUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return fail('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  if (parsed.data.navLinkId && parsed.data.navLinkId !== existing.navLinkId) {
    const parent = await db.navLink.findUnique({ where: { id: parsed.data.navLinkId } });
    if (!parent) return fail('Target parent nav link not found');
  }

  const updated = await db.navSubLink.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/', 'layout');
  revalidatePath('/');
  return ok(updated);
}

export async function deleteNavSubLink(id: string): Promise<ActionResponse<any>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const existing = await db.navSubLink.findUnique({ where: { id } });
  if (!existing) return fail('Sub-link not found');

  const deleted = await db.navSubLink.delete({ where: { id } });

  revalidatePath('/', 'layout');
  revalidatePath('/');
  return ok(deleted);
}

export async function getNavbarSetting() {
  return db.navbarSetting.upsert({
    where: { id: SETTING_ID },
    update: {},
    create: { id: SETTING_ID },
  });
}

export async function updateNavbarSetting(input: unknown): Promise<ActionResponse<NavbarSettingRecord>> {
  const guard = await requireAdmin<NavbarSettingRecord>();
  if (guard) return guard;

  const parsed = navbarSettingSchema.safeParse(input);
  if (!parsed.success) {
    return fail('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const updated = await db.navbarSetting.upsert({
    where: { id: SETTING_ID },
    update: parsed.data,
    create: { id: SETTING_ID, ...parsed.data },
  });

  revalidatePath('/', 'layout');
  revalidatePath('/');
  return ok(updated);
}
