import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { db } from "@/lib/db";
import {
  heroSchema,
  categoriesFilterSchema,
  projectsGridSchema,
  testimonialsSchema,
  ctaSchema,
} from "@/modules/portfolio/validations";
import type { ZodSchema } from "zod";

const SECTION_SCHEMAS: Record<string, ZodSchema> = {
  hero: heroSchema,
  categories_filter: categoriesFilterSchema,
  projects_grid: projectsGridSchema,
  testimonials: testimonialsSchema,
  contact_cta: ctaSchema,
};

export async function GET() {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const sections = await db.portfolioPage.findMany({ orderBy: { sortOrder: "asc" } });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;

    const projects = await db.portfolioProject.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: { sections: data, projects } });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const body = (await req.json()) as { section: string; content: unknown };
    const schema = SECTION_SCHEMAS[body.section];
    if (!schema) {
      return NextResponse.json({ success: false, error: "Unknown section" }, { status: 400 });
    }
    const validated = schema.parse(body.content);
    const result = await db.portfolioPage.upsert({
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
