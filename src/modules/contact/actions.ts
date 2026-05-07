"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  heroSchema,
  contactInfoSchema,
  contactFormSchema,
  mapSchema,
  faqSchema,
  ctaSchema,
  contactInquirySchema,
  seoSchema,
} from "./validations";
import {
  upsertContactSection,
  createContactInquiry,
  markInquiryAsRead,
  deleteInquiry,
} from "./data/mutations";
import { upsertLegacyPageSeo } from '@/modules/seo/data/mutations';

function revalidateContact() {
  revalidatePath("/contact");
  revalidatePath("/admin/dashboard/contact");
}

export async function updateContactHero(raw: unknown) {
  try {
    await requirePermission("MANAGE_CONTACT");
    const data = heroSchema.parse(raw);
    await upsertContactSection("hero", data);
    revalidateContact();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateContactInfo(raw: unknown) {
  try {
    await requirePermission("MANAGE_CONTACT");
    const data = contactInfoSchema.parse(raw);
    await upsertContactSection("contact_info", data);
    revalidateContact();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateContactForm(raw: unknown) {
  try {
    await requirePermission("MANAGE_CONTACT");
    const data = contactFormSchema.parse(raw);
    await upsertContactSection("contact_form", data);
    revalidateContact();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateContactMap(raw: unknown) {
  try {
    await requirePermission("MANAGE_CONTACT");
    const data = mapSchema.parse(raw);
    await upsertContactSection("map", data);
    revalidateContact();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateContactFaq(raw: unknown) {
  try {
    await requirePermission("MANAGE_CONTACT");
    const data = faqSchema.parse(raw);
    await upsertContactSection("faq", data);
    revalidateContact();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateContactCta(raw: unknown) {
  try {
    await requirePermission("MANAGE_CONTACT");
    const data = ctaSchema.parse(raw);
    await upsertContactSection("contact_cta", data);
    revalidateContact();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function submitContactInquiry(raw: unknown) {
  try {
    const data = contactInquirySchema.parse(raw);
    await createContactInquiry({ ...data, isRead: false, createdAt: new Date() });
    revalidatePath("/contact");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function markInquiryAsReadAction(id: string) {
  try {
    await requirePermission("MANAGE_CONTACT");
    await markInquiryAsRead(id);
    revalidateContact();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function deleteInquiryAction(id: string) {
  try {
    await requirePermission("MANAGE_CONTACT");
    await deleteInquiry(id);
    revalidateContact();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateContactSeo(raw: unknown) {
  try {
    await requirePermission("MANAGE_CONTACT");
    const data = seoSchema.parse(raw);
    await upsertLegacyPageSeo("contact", data);
    revalidatePath("/contact");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
