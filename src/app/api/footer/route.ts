import { NextResponse } from "next/server";
import { getFooterData } from "@/modules/footer/data/queries";
import { withFooterFallback } from "@/modules/footer/data/defaults";
import type { FooterData } from "@/modules/footer/types";

function flattenFooterData(data: FooterData) {
  const settings = data.settings ?? {};
  const socialSection = data.sections.find((section) =>
    section.title.toLowerCase().includes("social"),
  );
  const socialLinks = Object.fromEntries(
    (socialSection?.links ?? []).map((link) => [link.label.toLowerCase(), link.href]),
  );

  return {
    logo: settings.logo,
    description: settings.description,
    contact: settings.email,
    address: settings.address,
    socialLinks,
  };
}

export async function GET() {
  try {
    const data = withFooterFallback(await getFooterData());
    return NextResponse.json({ success: true, data, footer: flattenFooterData(data) });
  } catch (err) {
    console.error("Failed to fetch footer data", err);
    const data = withFooterFallback(null);
    return NextResponse.json({ success: true, data, footer: flattenFooterData(data), fallback: true });
  }
}
