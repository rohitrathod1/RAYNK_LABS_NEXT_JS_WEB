"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  serviceHeroSchema,
  servicesListSchema,
  whyChooseSchema,
  processSchema,
  contactCtaSchema,
  seoSchema,
} from "./validations";
import { upsertServicesSection } from "./data/mutations";
import { upsertLegacyPageSeo } from '@/modules/seo/data/mutations';

function revalidateServices() {
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function updateServicesHero(raw: unknown) {
  try {
    await requirePermission("MANAGE_SERVICES");
    const data = serviceHeroSchema.parse(raw);
    await upsertServicesSection("hero", data);
    revalidateServices();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateServicesCategories(raw: unknown) {
  try {
    await requirePermission("MANAGE_SERVICES");
    const data = JSON.parse(JSON.stringify(raw));
    await upsertServicesSection("categories", data);
    revalidateServices();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateServicesList(raw: unknown) {
  try {
    await requirePermission("MANAGE_SERVICES");
    const data = servicesListSchema.parse(raw);
    await upsertServicesSection("services_list", data);
    revalidateServices();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateServicesWhyChoose(raw: unknown) {
  try {
    await requirePermission("MANAGE_SERVICES");
    const data = whyChooseSchema.parse(raw);
    await upsertServicesSection("why_choose_service", data);
    revalidateServices();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateServicesProcess(raw: unknown) {
  try {
    await requirePermission("MANAGE_SERVICES");
    const data = processSchema.parse(raw);
    await upsertServicesSection("process", data);
    revalidateServices();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateServicesCta(raw: unknown) {
  try {
    await requirePermission("MANAGE_SERVICES");
    const data = contactCtaSchema.parse(raw);
    await upsertServicesSection("contact_cta", data);
    revalidateServices();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateServicesSeo(raw: unknown) {
  try {
    await requirePermission("MANAGE_SERVICES");
    const data = seoSchema.parse(raw);
    await upsertLegacyPageSeo("services", data);
    revalidatePath("/services");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
