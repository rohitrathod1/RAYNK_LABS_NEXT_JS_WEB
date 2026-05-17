import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync, createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";

export const runtime = "nodejs";

const RESUME_DIR = path.join(process.cwd(), "uploads", "resumes");

function contentTypeFor(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".doc") return "application/msword";
  if (ext === ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
}

export async function GET(_req: NextRequest, context: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await context.params;
    if (!filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const filePath = path.join(RESUME_DIR, filename);
    if (!existsSync(filePath)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const fileStats = await stat(filePath);
    const stream = Readable.toWeb(createReadStream(filePath));

    return new NextResponse(stream as BodyInit, {
      headers: {
        "Content-Type": contentTypeFor(filename),
        "Content-Length": String(fileStats.size),
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    console.error("[resumes] GET error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
