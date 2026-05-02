import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
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
} from "@/modules/home/validations";
import type { ZodSchema } from "zod";

const SECTION_SCHEMAS: Record<string, ZodSchema> = {
  hero: heroSchema,
  initiatives: initiativesSchema,
  services: servicesSchema,
  why_digital: whyDigitalSchema,
  portfolio_preview: portfolioSchema,
  testimonials: testimonialsSchema,
  why_choose_us: whyChooseSchema,
  contact_cta: ctaSchema,
};

export async function GET() {
  try {
    await requirePermission("EDIT_HOME");
    const sections = await db.homePage.findMany({ orderBy: { sortOrder: "asc" } });
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
    await requirePermission("EDIT_HOME");
    const body = (await req.json()) as { section: string; content: unknown };
    const schema = SECTION_SCHEMAS[body.section];
    if (!schema) {
      return NextResponse.json({ success: false, error: "Unknown section" }, { status: 400 });
    }
    const validated = schema.parse(body.content);
    const result = await db.homePage.upsert({
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
