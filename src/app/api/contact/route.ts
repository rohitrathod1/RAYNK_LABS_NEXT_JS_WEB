import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactInquirySchema } from "@/modules/contact/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactInquirySchema.parse(body);

    const inquiry = await db.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        subject: data.subject ?? null,
        message: data.message,
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function GET() {
  try {
    const sections = await db.contactPage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
