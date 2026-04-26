import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  heroSchema,
  missionSchema,
  featuredProductsSchema,
  healthBenefitsSchema,
  testimonialsSchema,
  ctaSchema,
} from "@/modules/home/validations";
import type { ZodSchema } from "zod";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    throw new Error("Unauthorized");
  }
}

const SECTION_SCHEMAS: Record<string, ZodSchema> = {
  hero: heroSchema,
  mission: missionSchema,
  "featured-products": featuredProductsSchema,
  "health-benefits": healthBenefitsSchema,
  testimonials: testimonialsSchema,
  cta: ctaSchema,
};

export async function GET() {
  try {
    await assertAdmin();
    const sections = await db.homePage.findMany({ orderBy: { sortOrder: "asc" } });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await assertAdmin();
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
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: msg === "Unauthorized" ? 401 : 400 });
  }
}
