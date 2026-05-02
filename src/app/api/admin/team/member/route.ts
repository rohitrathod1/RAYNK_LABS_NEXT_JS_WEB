import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { db } from "@/lib/db";
import { teamMemberInputSchema } from "@/modules/team/validations";

export async function GET() {
  try {
    await requirePermission("MANAGE_TEAM");
    const members = await db.teamMember.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: members });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_TEAM");
    const body = (await req.json()) as Record<string, unknown>;
    const validated = teamMemberInputSchema.parse(body);

    const member = await db.teamMember.create({
      data: {
        name: validated.name,
        role: validated.role,
        bio: validated.bio || undefined,
        image: validated.image,
        linkedin: validated.linkedin || undefined,
        twitter: validated.twitter || undefined,
        github: validated.github || undefined,
        portfolio: validated.portfolio || undefined,
        isActive: validated.isActive ?? true,
        sortOrder: validated.sortOrder ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: member });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requirePermission("MANAGE_TEAM");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Member ID required" }, { status: 400 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const validated = teamMemberInputSchema.parse(body);

    const member = await db.teamMember.update({
      where: { id },
      data: {
        name: validated.name,
        role: validated.role,
        bio: validated.bio || undefined,
        image: validated.image,
        linkedin: validated.linkedin || undefined,
        twitter: validated.twitter || undefined,
        github: validated.github || undefined,
        portfolio: validated.portfolio || undefined,
        isActive: validated.isActive ?? true,
        sortOrder: validated.sortOrder ?? 0,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: member });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requirePermission("MANAGE_TEAM");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Member ID required" }, { status: 400 });
    }

    await db.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
