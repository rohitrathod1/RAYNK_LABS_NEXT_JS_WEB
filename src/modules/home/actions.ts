"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  heroSchema,
  initiativesSchema,
  servicesSchema,
  whyDigitalSchema,
  portfolioSchema,
  testimonialsSchema,
  whyChooseSchema,
  ctaSchema,
  seoSchema,
} from "./validations";
import { upsertHomeSection } from "./data/mutations";
import { upsertLegacyPageSeo } from '@/modules/seo/data/mutations';

function revalidateHome() {
  revalidatePath("/");
  revalidatePath("/admin/dashboard/home");
}

export async function updateHomeHero(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = heroSchema.parse(raw);
    await upsertHomeSection("hero", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeInitiatives(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = initiativesSchema.parse(raw);
    await upsertHomeSection("initiatives", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeServices(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = servicesSchema.parse(raw);
    await upsertHomeSection("services", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeWhyDigital(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = whyDigitalSchema.parse(raw);
    await upsertHomeSection("why_digital", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomePortfolio(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = portfolioSchema.parse(raw);
    await upsertHomeSection("portfolio_preview", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeTestimonials(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = testimonialsSchema.parse(raw);
    await upsertHomeSection("testimonials", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeWhyChoose(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = whyChooseSchema.parse(raw);
    await upsertHomeSection("why_choose_us", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeCta(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = ctaSchema.parse(raw);
    await upsertHomeSection("contact_cta", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeSeo(raw: unknown) {
  try {
    await requirePermission("EDIT_HOME");
    const data = seoSchema.parse(raw);
    await upsertLegacyPageSeo("home", data);
    revalidatePath("/");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
