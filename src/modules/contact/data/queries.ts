import { db } from "@/lib/db";
import type { ContactPageData } from "../types";
import { defaultContactContent } from "./defaults";

export async function getContactPageData(): Promise<ContactPageData> {
  const sections = await db.contactPage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const data: Record<string, unknown> = {};
  for (const s of sections) data[s.section] = s.content;

  return {
    hero: (data.hero as ContactPageData["hero"]) ?? defaultContactContent.hero,
    contact_info: (data.contact_info as ContactPageData["contact_info"]) ?? defaultContactContent.contact_info,
    contact_form: (data.contact_form as ContactPageData["contact_form"]) ?? defaultContactContent.contact_form,
    map: (data.map as ContactPageData["map"]) ?? defaultContactContent.map,
    faq: (data.faq as ContactPageData["faq"]) ?? defaultContactContent.faq,
    contact_cta: (data.contact_cta as ContactPageData["contact_cta"]) ?? defaultContactContent.contact_cta,
  };
}

export async function getContactSection(section: string) {
  return db.contactPage.findUnique({ where: { section } });
}

export async function getContactInquiries(isRead?: boolean) {
  const where = isRead !== undefined ? { isRead } : {};
  return db.contactInquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getContactInquiryById(id: string) {
  return db.contactInquiry.findUnique({ where: { id } });
}

export async function getContactSeo() {
  return db.seoPage.findUnique({ where: { page: "contact" } });
}

export async function getUnreadInquiryCount() {
  return db.contactInquiry.count({ where: { isRead: false } });
}
