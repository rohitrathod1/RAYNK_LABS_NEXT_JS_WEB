"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SeoTabPanel } from "@/modules/seo";
import { hasPermission } from "@/lib/permissions";

const SEO_PAGES = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "portfolio", label: "Portfolio" },
  { key: "blog", label: "Blog" },
  { key: "team", label: "Team" },
  { key: "contact", label: "Contact" },
];

export default function SeoDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_SEO")) {
      router.push("/admin");
    }
  }, [session, router]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">SEO Dashboard</h1>
        <p className="text-muted-foreground">
          Manage SEO metadata for each page. Select a page below to edit its SEO settings.
        </p>
      </div>

      <div className="grid gap-6">
        {SEO_PAGES.map((page) => (
          <div key={page.key} className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">{page.label}</h2>
            <SeoTabPanel page={page.key} pageLabel={page.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
