import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileUpdateSchema } from "@/modules/profile/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await db.admin.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await db.admin.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = profileUpdateSchema.parse(body);

    const updated = await db.admin.update({
      where: { id: user.id },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
