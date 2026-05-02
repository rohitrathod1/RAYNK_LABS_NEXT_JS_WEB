"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  heroSchema,
  storySchema,
  missionSchema,
  whyChooseSchema,
  coreTeamSchema,
  socialLinksSchema,
  seoSchema,
} from "./validations";
import { upsertAboutSection } from "./data/mutations";

function revalidateAbout() {
  revalidatePath("/about");
  revalidatePath("/admin/dashboard/about");
}

export async function updateAboutHero(raw: unknown) {
  try {
    await requirePermission("EDIT_ABOUT");
    const data = heroSchema.parse(raw);
    await upsertAboutSection("hero", data);
    revalidateAbout();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateAboutStory(raw: unknown) {
  try {
    await requirePermission("EDIT_ABOUT");
    const data = storySchema.parse(raw);
    await upsertAboutSection("story", data);
    revalidateAbout();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateAboutMission(raw: unknown) {
  try {
    await requirePermission("EDIT_ABOUT");
    const data = missionSchema.parse(raw);
    await upsertAboutSection("mission", data);
    revalidateAbout();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateAboutWhyChoose(raw: unknown) {
  try {
    await requirePermission("EDIT_ABOUT");
    const data = whyChooseSchema.parse(raw);
    await upsertAboutSection("why_choose_us", data);
    revalidateAbout();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateAboutCoreTeam(raw: unknown) {
  try {
    await requirePermission("EDIT_ABOUT");
    const data = coreTeamSchema.parse(raw);
    await upsertAboutSection("core_team", data);
    revalidateAbout();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateAboutSocialLinks(raw: unknown) {
  try {
    await requirePermission("EDIT_ABOUT");
    const data = socialLinksSchema.parse(raw);
    await upsertAboutSection("social_links", data);
    revalidateAbout();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateAboutSeo(raw: unknown) {
  try {
    await requirePermission("EDIT_ABOUT");
    const data = seoSchema.parse(raw);
    await db.seo.upsert({
      where: { page: "about" },
      update: { ...data, updatedAt: new Date() },
      create: { page: "about", ...data },
    });
    revalidatePath("/about");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
