import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";
import { checkLimit } from "@/lib/rate-limit-local";

const TYPE_OPTIONS = [
  "contact",
  "service",
  "feedback",
  "team",
  "project",
  "seo",
  "work_with_us",
  "join_team",
  "partnership",
  "project_inquiry",
  "other",
] as const;
const STATUS_OPTIONS = ["read", "unread"] as const;
const MAX_METADATA_KEYS = 30;

const submissionSchema = z.object({
  type: z.string().trim().min(1).max(60).default("contact"),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(180).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().max(160).optional().or(z.literal("")),
  serviceName: z.string().trim().max(160).optional().or(z.literal("")),
  budget: z.string().trim().max(160).optional().or(z.literal("")),
  timeline: z.string().trim().max(160).optional().or(z.literal("")),
  roleInterestedIn: z.string().trim().max(160).optional().or(z.literal("")),
  experienceLevel: z.string().trim().max(120).optional().or(z.literal("")),
  portfolioUrl: z.string().trim().max(220).optional().or(z.literal("")),
  resumeUrl: z.string().trim().max(220).optional().or(z.literal("")),
  sourcePage: z.string().trim().max(220).optional().or(z.literal("")),
  metadata: z.record(z.string(), z.unknown()).optional(),
  website: z.string().trim().max(0).optional().or(z.literal("")),
});

function clean(value: string | undefined) {
  if (!value) return null;
  return value.replace(/[<>]/g, "").trim() || null;
}

function cleanMetadata(metadata: Record<string, unknown> | undefined) {
  if (!metadata) return undefined;
  return Object.fromEntries(
    Object.entries(metadata)
      .slice(0, MAX_METADATA_KEYS)
      .map(([key, value]) => [key.replace(/[<>]/g, "").slice(0, 80), value]),
  );
}

function normalizeType(type: string) {
  const normalized = type.toLowerCase().replace(/\s+/g, "_");
  return TYPE_OPTIONS.includes(normalized as (typeof TYPE_OPTIONS)[number]) ? normalized : "other";
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkLimit(`submission:${ip}`, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    const raw = await req.json();
    const parsed = submissionSchema.parse(raw);

    if (parsed.website) {
      return NextResponse.json({ success: true, data: null }, { status: 202 });
    }

    if (!parsed.email && !parsed.phone) {
      return NextResponse.json({ success: false, error: "Email or phone is required" }, { status: 400 });
    }

    if (!parsed.message && !parsed.subject && !parsed.service && !parsed.serviceName) {
      return NextResponse.json({ success: false, error: "Message, subject, or service is required" }, { status: 400 });
    }

    const normalizedServiceName = clean(parsed.serviceName) ?? clean(parsed.service) ?? clean(parsed.subject);
    const metadata = {
      ...(cleanMetadata(parsed.metadata) ?? {}),
      budget: clean(parsed.budget),
      timeline: clean(parsed.timeline),
      serviceName: normalizedServiceName,
      roleInterestedIn: clean(parsed.roleInterestedIn),
      experienceLevel: clean(parsed.experienceLevel),
      portfolioUrl: clean(parsed.portfolioUrl),
      resumeUrl: clean(parsed.resumeUrl),
    };

    const submission = await db.submission.create({
      data: {
        type: normalizeType(parsed.type),
        name: clean(parsed.name),
        email: clean(parsed.email)?.toLowerCase() ?? null,
        phone: clean(parsed.phone),
        subject: clean(parsed.subject),
        message: clean(parsed.message),
        company: clean(parsed.company),
        service: normalizedServiceName,
        sourcePage: clean(parsed.sourcePage) ?? req.headers.get("referer"),
        metadata: metadata as never,
      },
    });

    return NextResponse.json({ success: true, data: { id: submission.id } }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid submission";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await requirePermission("MANAGE_SUBMISSIONS");
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();
    const type = url.searchParams.get("type")?.trim();
    const status = url.searchParams.get("status")?.trim();
    const service = url.searchParams.get("service")?.trim();

    const where = {
      ...(type && type !== "all" ? { type } : {}),
      ...(status && status !== "all" && STATUS_OPTIONS.includes(status as (typeof STATUS_OPTIONS)[number]) ? { status } : {}),
      ...(service && service !== "all" ? { service } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { message: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [submissions, total, unread, read, groups, services] = await Promise.all([
      db.submission.findMany({ where, orderBy: { createdAt: "desc" } }),
      db.submission.count(),
      db.submission.count({ where: { status: "unread" } }),
      db.submission.count({ where: { status: "read" } }),
      db.submission.groupBy({ by: ["type"], _count: { type: true } }),
      db.submission.findMany({ where: { service: { not: null } }, distinct: ["service"], select: { service: true }, orderBy: { service: "asc" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        submissions,
        stats: {
          total,
          unread,
          read,
          types: groups.length,
          typeCounts: groups.map((group) => ({ type: group.type, count: group._count.type })),
          services: services.map((entry) => entry.service).filter(Boolean),
        },
      },
    });
  } catch (err) {
    const statusCode = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: message }, { status: statusCode });
  }
}

