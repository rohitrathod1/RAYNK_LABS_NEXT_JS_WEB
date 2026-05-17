import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { checkLimit } from "@/lib/rate-limit-local";

export const runtime = "nodejs";

const RESUME_DIR = path.join(process.cwd(), "uploads", "resumes");
const MAX_RESUME_SIZE = 6 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function sanitizeFilename(name: string) {
  return (
    name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "resume"
  );
}

function extensionFor(type: string, originalName: string) {
  if (type === "application/pdf") return ".pdf";
  if (type === "application/msword") return ".doc";
  if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return ".docx";
  const ext = path.extname(originalName).toLowerCase();
  return ext || ".pdf";
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkLimit(`team-resume:${getClientIp(req)}`, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Too many uploads. Please try again later." }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_RESUME_SIZE) {
      return NextResponse.json({ success: false, error: "Resume must be 6MB or smaller" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, error: "Only PDF, DOC, and DOCX files are allowed" }, { status: 400 });
    }

    if (!existsSync(RESUME_DIR)) {
      await mkdir(RESUME_DIR, { recursive: true });
    }

    const filename = `${Date.now()}-${sanitizeFilename(file.name)}${extensionFor(file.type, file.name)}`;
    const filePath = path.join(RESUME_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      data: {
        filename: file.name,
        storedFilename: filename,
        url: `/api/resumes/${encodeURIComponent(filename)}`,
      },
    });
  } catch (error) {
    console.error("[team-resume] POST error:", error);
    return NextResponse.json({ success: false, error: "Resume upload failed" }, { status: 500 });
  }
}
