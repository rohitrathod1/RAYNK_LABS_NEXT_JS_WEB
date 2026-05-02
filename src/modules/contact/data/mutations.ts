import { db } from "@/lib/db";

export async function upsertContactSection(section: string, content: unknown) {
  return db.contactPage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}

export async function createContactInquiry(data: unknown) {
  return db.contactInquiry.create({
    data: data as never,
  });
}

export async function markInquiryAsRead(id: string) {
  return db.contactInquiry.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function deleteInquiry(id: string) {
  return db.contactInquiry.delete({
    where: { id },
  });
}
