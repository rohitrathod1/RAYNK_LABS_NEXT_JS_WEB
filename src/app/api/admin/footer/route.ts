import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/middleware/permission";
import { db } from "@/lib/db";
import { getFooterData } from "@/modules/footer/data/queries";
import { upsertFooterSettings } from "@/modules/footer/data/mutations";
import { withFooterFallback } from "@/modules/footer/data/defaults";
import { footerSettingsSchema } from "@/modules/footer/validations";

type FooterRequestBody = {
  logo?: string;
  description?: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  copyright?: string;
  socialLinks?: Record<string, string>;
};

function labelFromKey(key: string) {
  return key
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function upsertSocialLinks(socialLinks?: Record<string, string>) {
  if (!socialLinks) return;

  const entries = Object.entries(socialLinks).filter(([, href]) => href?.trim());
  let section = await db.footerSection.findFirst({ where: { title: "Social Links" } });

  if (!section) {
    section = await db.footerSection.create({
      data: { title: "Social Links", sortOrder: 99, isActive: true },
    });
  }

  await db.footerLink.deleteMany({ where: { sectionId: section.id } });

  if (entries.length) {
    await db.footerLink.createMany({
      data: entries.map(([key, href], index) => ({
        label: labelFromKey(key),
        href,
        sectionId: section.id,
        sortOrder: index,
      })),
    });
  }
}

export async function GET() {
  try {
    await requirePermission("MANAGE_FOOTER");
    const data = await getFooterData();
    return NextResponse.json({ success: true, data: withFooterFallback(data) });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to load footer data";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_FOOTER");
    const body = (await req.json()) as FooterRequestBody;
    const data = footerSettingsSchema.parse({
      logo: body.logo,
      description: body.description,
      address: body.address,
      email: body.email ?? body.contact,
      phone: body.phone,
      copyright: body.copyright,
    });
    const settings = await upsertFooterSettings(data);
    await upsertSocialLinks(body.socialLinks);
    revalidatePath("/");
    revalidatePath("/admin/footer");
    return NextResponse.json({ success: true, data: settings });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to save footer settings";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
