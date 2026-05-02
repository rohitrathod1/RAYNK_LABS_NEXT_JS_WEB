import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { db } from "@/lib/db";
import {
  heroSchema,
  contactInfoSchema,
  contactFormSchema,
  mapSchema,
  faqSchema,
  ctaSchema,
} from "@/modules/contact/validations";
import type { ZodSchema } from "zod";

const SECTION_SCHEMAS: Record<string, ZodSchema> = {
  hero: heroSchema,
  contact_info: contactInfoSchema,
  contact_form: contactFormSchema,
  map: mapSchema,
  faq: faqSchema,
  contact_cta: ctaSchema,
};

export async function GET() {
  try {
    await requirePermission("MANAGE_CONTACT");
    const sections = await db.contactPage.findMany({ orderBy: { sortOrder: "asc" } });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;
    const inquiries = await db.contactInquiry.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: { sections: data, inquiries } });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_CONTACT");
    const body = (await req.json()) as { section: string; content: unknown };
    const schema = SECTION_SCHEMAS[body.section];
    if (!schema) {
      return NextResponse.json({ success: false, error: "Unknown section" }, { status: 400 });
    }
    const validated = schema.parse(body.content);
    const result = await db.contactPage.upsert({
      where: { section: body.section },
      update: { content: validated as never, updatedAt: new Date() },
      create: { section: body.section, content: validated as never },
    });
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
