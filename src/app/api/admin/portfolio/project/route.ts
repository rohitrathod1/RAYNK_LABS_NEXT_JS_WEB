import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { db } from "@/lib/db";
import { projectSchema } from "@/modules/portfolio/validations";

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const body = (await req.json()) as Record<string, unknown>;
    const validated = projectSchema.parse(body);
    const project = await db.portfolioProject.create({ data: validated });
    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Project ID required" }, { status: 400 });
    }
    const body = (await req.json()) as Record<string, unknown>;
    const validated = projectSchema.parse(body);
    const project = await db.portfolioProject.update({
      where: { id },
      data: validated,
    });
    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requirePermission("MANAGE_PORTFOLIO");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Project ID required" }, { status: 400 });
    }
    await db.portfolioProject.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
