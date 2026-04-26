"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Home,
  Info,
  Sparkles,
  FolderOpen,
  Newspaper,
  Users,
  Briefcase,
  MessageSquare,
  Package,
  Navigation,
  PanelBottom,
  Globe,
  Search,
  Settings,
} from "lucide-react";

interface PageEntry {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const ALL_PAGES: PageEntry[] = [
  {
    label: "Home Page",
    href: "/admin/home",
    icon: Home,
    description: "Hero, mission, products, testimonials, CTA",
    color: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    label: "About Page",
    href: "/admin/about",
    icon: Info,
    description: "Story, team, values & mission sections",
    color: "from-sky-500/20 to-sky-600/5",
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Sparkles,
    description: "All service offerings and categories",
    color: "from-violet-500/20 to-violet-600/5",
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderOpen,
    description: "Project portfolio and case studies",
    color: "from-amber-500/20 to-amber-600/5",
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: Newspaper,
    description: "Articles, tutorials, announcements",
    color: "from-rose-500/20 to-rose-600/5",
  },
  {
    label: "Team Members",
    href: "/admin/team",
    icon: Users,
    description: "Team profiles, roles and bios",
    color: "from-indigo-500/20 to-indigo-600/5",
  },
  {
    label: "Careers",
    href: "/admin/careers",
    icon: Briefcase,
    description: "Job listings and applications",
    color: "from-orange-500/20 to-orange-600/5",
  },
  {
    label: "Community",
    href: "/admin/contact",
    icon: MessageSquare,
    description: "Contact forms and newsletter",
    color: "from-teal-500/20 to-teal-600/5",
  },
  {
    label: "Our Products",
    href: "/admin/products",
    icon: Package,
    description: "Product showcase and details",
    color: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    label: "Navbar",
    href: "/admin/navbar",
    icon: Navigation,
    description: "Navigation links and sub-links",
    color: "from-fuchsia-500/20 to-fuchsia-600/5",
  },
  {
    label: "Footer",
    href: "/admin/footer",
    icon: PanelBottom,
    description: "Columns, links and contact settings",
    color: "from-lime-500/20 to-lime-600/5",
  },
  {
    label: "SEO Manager",
    href: "/admin/seo",
    icon: Globe,
    description: "Meta titles, descriptions and OG images",
    color: "from-yellow-500/20 to-yellow-600/5",
  },
];

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return ALL_PAGES;
    const q = searchQuery.toLowerCase();
    return ALL_PAGES.filter(
      (p) =>
        p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-5xl py-4 sm:py-8 2xl:max-w-7xl 2xl:py-10">
      {/* Header */}
      <div className="mb-8 text-center sm:mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary sm:text-sm 2xl:text-base">
          Admin Dashboard
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
          <span className="text-foreground">Welcome to </span>
          <span className="admin-gradient-text">RaYnk Labs</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground 2xl:max-w-xl 2xl:text-base">
          Manage your website content. Use the sidebar to navigate sections, or search below.
        </p>
      </div>

      {/* Search */}
      <div className="relative mx-auto mb-8 max-w-md 2xl:max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search pages..."
          className="w-full rounded-xl border bg-card py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Section heading */}
      <div className="mb-5 flex items-center gap-2">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Pages &amp; Settings
        </h2>
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 py-10 text-center">
          <Search className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No pages match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 2xl:grid-cols-5 2xl:gap-6">
          {filtered.map((page) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.href}
                href={page.href}
                className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg 2xl:gap-4 2xl:p-8"
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${page.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                {/* Icon */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 2xl:h-14 2xl:w-14 2xl:rounded-2xl">
                  <Icon size={24} className="text-primary" />
                </div>

                {/* Text */}
                <div className="relative z-10">
                  <span className="text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary 2xl:text-base">
                    {page.label}
                  </span>
                  <p className="mt-1 text-[11px] leading-tight text-muted-foreground 2xl:text-xs">
                    {page.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
