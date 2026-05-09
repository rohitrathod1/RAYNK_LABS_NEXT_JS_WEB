import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requirePermission("MANAGE_SUBMISSIONS");
    const { id } = await params;
    const body = (await req.json()) as { status?: string };
    const status = body.status === "read" ? "read" : "unread";

    const submission = await db.submission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (err) {
    const statusCode = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: message }, { status: statusCode });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requirePermission("MANAGE_SUBMISSIONS");
    const { id } = await params;
    await db.submission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const statusCode = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: message }, { status: statusCode });
  }
}
