import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/middleware/permission";
import { deleteNavLink, updateNavLink } from "@/modules/navbar/actions";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const { id } = await params;
    const body = await req.json();
    const result = await updateNavLink(id, body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requirePermission("MANAGE_NAVBAR");
    const { id } = await params;
    const result = await deleteNavLink(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
