import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkLimit } from "@/lib/rate-limit-local";
import { contactInquirySchema } from "@/modules/contact/validations";

function clean(value: string | undefined) {
  if (!value) return null;
  return value.replace(/[<>]/g, "").trim() || null;
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkLimit(`contact:${getClientIp(req)}`, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Too many submissions. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
    }

    const body = await req.json();
    const data = contactInquirySchema.parse(body);
    if (data.website) {
      return NextResponse.json({ success: true, data: null }, { status: 202 });
    }

    const subject = clean(data.subject) || clean(data.serviceType) || "Project inquiry";
    const enrichedMessage = [
      clean(data.message),
      "",
      "Project details:",
      data.company ? `Company: ${clean(data.company)}` : null,
      data.serviceType ? `Service: ${clean(data.serviceType)}` : null,
      data.budgetRange ? `Budget: ${clean(data.budgetRange)}` : null,
      data.projectTimeline ? `Timeline: ${clean(data.projectTimeline)}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const inquiry = await db.contactInquiry.create({
      data: {
        name: clean(data.name) ?? "Visitor",
        email: clean(data.email)?.toLowerCase() ?? "",
        phone: clean(data.phone),
        subject,
        message: enrichedMessage,
        isRead: false,
      },
    });

    await db.submission.create({
      data: {
        type: "contact",
        name: clean(data.name),
        email: clean(data.email)?.toLowerCase() ?? null,
        phone: clean(data.phone),
        company: clean(data.company),
        service: clean(data.serviceType),
        subject,
        message: enrichedMessage,
        sourcePage: "/contact",
        status: "unread",
        metadata: {
          budget: clean(data.budgetRange),
          timeline: clean(data.projectTimeline),
          serviceName: clean(data.serviceType),
        } as never,
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
