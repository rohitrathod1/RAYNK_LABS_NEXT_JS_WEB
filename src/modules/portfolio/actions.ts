"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  heroSchema,
  categoriesFilterSchema,
  projectsGridSchema,
  testimonialsSchema,
  ctaSchema,
  projectSchema,
  seoSchema,
} from "./validations";
import {
  upsertPortfolioSection,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  toggleProjectFeatured,
  toggleProjectActive,
} from "./data/mutations";
import { upsertLegacyPageSeo } from '@/modules/seo/data/mutations';

function revalidatePortfolio() {
  revalidatePath("/portfolio");
  revalidatePath("/admin/dashboard/portfolio");
}

export async function updatePortfolioHero(raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = heroSchema.parse(raw);
    await upsertPortfolioSection("hero", data);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updatePortfolioCategories(raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = categoriesFilterSchema.parse(raw);
    await upsertPortfolioSection("categories_filter", data);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updatePortfolioProjectsGrid(raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = projectsGridSchema.parse(raw);
    await upsertPortfolioSection("projects_grid", data);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updatePortfolioTestimonials(raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = testimonialsSchema.parse(raw);
    await upsertPortfolioSection("testimonials", data);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updatePortfolioCta(raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = ctaSchema.parse(raw);
    await upsertPortfolioSection("contact_cta", data);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updatePortfolioSeo(raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = seoSchema.parse(raw);
    await upsertLegacyPageSeo("portfolio", data);
    revalidatePath("/portfolio");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function createProjectAction(raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = projectSchema.parse(raw);
    const project = await createPortfolioProject(data);
    revalidatePortfolio();
    return ok(project);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateProjectAction(id: string, raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = projectSchema.parse(raw);
    const project = await updatePortfolioProject(id, data);
    revalidatePortfolio();
    return ok(project);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    await deletePortfolioProject(id);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function toggleProjectFeaturedAction(id: string, isFeatured: boolean) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    await toggleProjectFeatured(id, isFeatured);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function toggleProjectActiveAction(id: string, isActive: boolean) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    await toggleProjectActive(id, isActive);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updatePortfolioTestimonialsItems(raw: unknown) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const data = testimonialsSchema.parse(raw);
    await upsertPortfolioSection("testimonials", data);
    revalidatePortfolio();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
