import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactInquirySchema } from "@/modules/contact/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactInquirySchema.parse(body);
    if (data.website) {
      return NextResponse.json({ success: true, data: null });
    }

    const subject = data.subject || data.serviceType || "Project inquiry";
    const enrichedMessage = [
      data.message,
      "",
      "Project details:",
      data.company ? `Company: ${data.company}` : null,
      data.serviceType ? `Service: ${data.serviceType}` : null,
      data.budgetRange ? `Budget: ${data.budgetRange}` : null,
      data.projectTimeline ? `Timeline: ${data.projectTimeline}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const inquiry = await db.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone ?? null,
        subject,
        message: enrichedMessage,
        isRead: false,
      },
    });

    await db.submission.create({
      data: {
        type: "contact",
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        subject,
        message: enrichedMessage,
        sourcePage: "/contact",
        status: "unread",
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
