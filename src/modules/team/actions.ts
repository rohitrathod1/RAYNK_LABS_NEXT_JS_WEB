"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  heroSchema,
  introSchema,
  foundersSchema,
  teamMembersSchema,
  valuesSchema,
  ctaSchema,
  teamMemberInputSchema,
  seoSchema,
} from "./validations";
import {
  upsertTeamSection,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "./data/mutations";
import { upsertLegacyPageSeo } from '@/modules/seo/data/mutations';

function revalidateTeam() {
  revalidatePath("/team");
  revalidatePath("/admin/dashboard/team");
}

export async function updateTeamHero(raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = heroSchema.parse(raw);
    await upsertTeamSection("hero", data);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateTeamIntro(raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = introSchema.parse(raw);
    await upsertTeamSection("intro", data);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateTeamFounders(raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = foundersSchema.parse(raw);
    await upsertTeamSection("founders", data);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateTeamMembersSection(raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = teamMembersSchema.parse(raw);
    await upsertTeamSection("team_members", data);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateTeamValues(raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = valuesSchema.parse(raw);
    await upsertTeamSection("values", data);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateTeamCta(raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = ctaSchema.parse(raw);
    await upsertTeamSection("contact_cta", data);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function addTeamMember(raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = teamMemberInputSchema.parse(raw);
    await createTeamMember(data);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function editTeamMember(id: string, raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = teamMemberInputSchema.parse(raw);
    await updateTeamMember(id, data);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function removeTeamMember(id: string) {
  try {
    await requirePermission("MANAGE_TEAM");
    await deleteTeamMember(id);
    revalidateTeam();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateTeamSeo(raw: unknown) {
  try {
    await requirePermission("MANAGE_TEAM");
    const data = seoSchema.parse(raw);
    await upsertLegacyPageSeo("team", data);
    revalidatePath("/team");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
