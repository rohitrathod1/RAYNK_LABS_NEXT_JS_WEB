"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  heroSchema,
  missionSchema,
  featuredProductsSchema,
  healthBenefitsSchema,
  testimonialsSchema,
  ctaSchema,
  seoSchema,
} from "./validations";
import { upsertHomeSection } from "./data/mutations";

function revalidateHome() {
  revalidatePath("/");
  revalidatePath("/admin/home");
}

export async function updateHomeHero(raw: unknown) {
  try {
    await requireAdmin();
    const data = heroSchema.parse(raw);
    await upsertHomeSection("hero", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeMission(raw: unknown) {
  try {
    await requireAdmin();
    const data = missionSchema.parse(raw);
    await upsertHomeSection("mission", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeFeaturedProducts(raw: unknown) {
  try {
    await requireAdmin();
    const data = featuredProductsSchema.parse(raw);
    await upsertHomeSection("featured-products", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeHealthBenefits(raw: unknown) {
  try {
    await requireAdmin();
    const data = healthBenefitsSchema.parse(raw);
    await upsertHomeSection("health-benefits", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeTestimonials(raw: unknown) {
  try {
    await requireAdmin();
    const data = testimonialsSchema.parse(raw);
    await upsertHomeSection("testimonials", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeCta(raw: unknown) {
  try {
    await requireAdmin();
    const data = ctaSchema.parse(raw);
    await upsertHomeSection("cta", data);
    revalidateHome();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateHomeSeo(raw: unknown) {
  try {
    await requireAdmin();
    const data = seoSchema.parse(raw);
    await db.seo.upsert({
      where: { page: "home" },
      update: { ...data, updatedAt: new Date() },
      create: { page: "home", ...data },
    });
    revalidatePath("/");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
