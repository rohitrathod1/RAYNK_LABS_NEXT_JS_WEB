import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { db } from "@/lib/db";
import {
  serviceHeroSchema,
  servicesListSchema,
  whyChooseSchema,
  processSchema,
  contactCtaSchema,
} from "@/modules/services/validations";
import type { ZodSchema } from "zod";

const SECTION_SCHEMAS: Record<string, ZodSchema | undefined> = {
  hero: serviceHeroSchema,
  categories: undefined,
  services_list: servicesListSchema,
  why_choose_service: whyChooseSchema,
  process: processSchema,
  contact_cta: contactCtaSchema,
};

export async function GET() {
  try {
    await requirePermission("MANAGE_SERVICES");
    const sections = await db.servicesPage.findMany({ orderBy: { sortOrder: "asc" } });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_SERVICES");
    const body = (await req.json()) as { section: string; content: unknown };
    const schema = SECTION_SCHEMAS[body.section];
    if (!schema && body.section !== "categories") {
      return NextResponse.json({ success: false, error: "Unknown section" }, { status: 400 });
    }
    const validated = schema ? schema.parse(body.content) : body.content;
    const result = await db.servicesPage.upsert({
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
