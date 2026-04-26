"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  LayoutDashboard,
  Home,
  Navigation,
  PanelBottom,
  Globe,
  Sparkles,
  Package,
  Newspaper,
  Users,
  BookOpen,
  Briefcase,
  MessageSquare,
  Mail,
  Bell,
  Info,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Moon,
  Sun,
  ExternalLink,
  FolderOpen,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface NavChild {
  title: string;
  href: string;
  icon: React.ElementType;
  tab?: string;
}

interface NavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  children: NavChild[];
}

// ── Sidebar config ─────────────────────────────────────────────

const SIDEBAR: NavSection[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    children: [
      { title: "Home Page", href: "/admin/home", icon: Home },
      { title: "Navbar", href: "/admin/navbar", icon: Navigation },
      { title: "Footer", href: "/admin/footer", icon: PanelBottom },
    ],
  },
  {
    title: "About",
    href: "/admin/about",
    icon: Info,
    children: [
      { title: "About Page", href: "/admin/about", icon: Info },
    ],
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Sparkles,
    children: [
      { title: "Services Page", href: "/admin/services", icon: Sparkles },
    ],
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderOpen,
    children: [
      { title: "All Projects", href: "/admin/projects", icon: FolderOpen },
    ],
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: Newspaper,
    children: [
      { title: "All Posts", href: "/admin/blog", icon: Newspaper },
    ],
  },
  {
    title: "Team",
    href: "/admin/team",
    icon: Users,
    children: [
      { title: "Team Members", href: "/admin/team", icon: Users },
      { title: "Careers", href: "/admin/careers", icon: Briefcase },
    ],
  },
  {
    title: "Community",
    href: "/admin/community",
    icon: MessageSquare,
    children: [
      { title: "Contact Forms", href: "/admin/contact", icon: Mail },
      { title: "Newsletter", href: "/admin/newsletter", icon: Bell },
    ],
  },
  {
    title: "Our Products",
    href: "/admin/products",
    icon: Package,
    children: [
      { title: "All Products", href: "/admin/products", icon: Package },
    ],
  },
  {
    title: "SEO Manager",
    href: "/admin/seo",
    icon: Globe,
    children: [
      { title: "Home", href: "/admin/home", icon: Home, tab: "seo" },
      { title: "About", href: "/admin/about", icon: Info, tab: "seo" },
      { title: "Services", href: "/admin/services", icon: Sparkles, tab: "seo" },
      { title: "Projects", href: "/admin/projects", icon: FolderOpen, tab: "seo" },
      { title: "Blog", href: "/admin/blog", icon: BookOpen, tab: "seo" },
    ],
  },
];

// ── SidebarNav — isolated to allow Suspense wrapper ───────────

function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    for (const section of SIDEBAR) {
      const hasActiveChild = section.children.some((c) => {
        if (!pathname.startsWith(c.href)) return false;
        if (c.tab) return tabParam === c.tab;
        return !tabParam;
      });
      const isSelfActive = pathname === section.href;
      if (hasActiveChild || isSelfActive) {
        setExpanded((prev) => ({ ...prev, [section.title]: true }));
      }
    }
  }, [pathname, tabParam]);

  const toggle = useCallback((key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isChildActive = (child: NavChild) => {
    if (!pathname.startsWith(child.href)) return false;
    if (child.tab) return tabParam === child.tab;
    return !tabParam;
  };

  const isSectionActive = (section: NavSection) =>
    pathname === section.href || section.children.some((c) => isChildActive(c));

  return (
    <nav className="sidebar-scroll flex-1 space-y-0.5 overflow-y-auto p-3">
      {SIDEBAR.map((section) => {
        const active = isSectionActive(section);
        const isOpen = expanded[section.title] ?? false;
        const Icon = section.icon;

        return (
          <div key={section.title}>
            {/* Section header */}
            <div
              className={cn(
                "flex items-center rounded-lg transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground",
              )}
            >
              <Link
                href={section.href}
                className="flex flex-1 cursor-pointer items-center gap-3 py-2.5 pl-3 text-sm font-medium 2xl:py-3 2xl:pl-4 2xl:text-base"
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{section.title}</span>
              </Link>

              <button
                onClick={() => toggle(section.title)}
                className="cursor-pointer px-3 py-2.5 2xl:px-4 2xl:py-3"
                aria-label={isOpen ? `Collapse ${section.title}` : `Expand ${section.title}`}
              >
                <ChevronDown
                  size={16}
                  className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>
            </div>

            {/* Dropdown children */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-200 ease-in-out",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
              )}
            >
              <div className="ml-4 border-l border-border/50 py-1 pl-3">
                {section.children.length === 0 ? (
                  <span className="block py-2 text-[11px] italic text-muted-foreground/50">
                    No pages yet
                  </span>
                ) : (
                  section.children.map((child) => {
                    const ChildIcon = child.icon;
                    const childActive = isChildActive(child);
                    const childHref = child.tab ? `${child.href}?tab=${child.tab}` : child.href;
                    return (
                      <Link
                        key={childHref}
                        href={childHref}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition 2xl:px-3 2xl:py-2.5 2xl:text-sm",
                          childActive
                            ? "bg-primary/15 font-medium text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <ChildIcon size={14} className="shrink-0" />
                        <span className="truncate">{child.title}</span>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// ── Layout ────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        mobileOpen
      ) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────── */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card shadow-sm 2xl:w-72",
          "transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-64",
          "md:translate-x-0",
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-6 2xl:h-20 2xl:px-8">
          <Link href="/" title="Back to Website">
            <ArrowLeft
              size={20}
              className="cursor-pointer text-muted-foreground hover:text-primary transition-colors 2xl:h-6 2xl:w-6"
            />
          </Link>
          <span className="text-base font-bold tracking-tight">RaYnk Labs</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="cursor-pointer md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
          <div className="hidden w-5 md:block" />
        </div>

        {/* Nav — Suspense wrapper required for useSearchParams */}
        <Suspense
          fallback={
            <div className="flex-1 space-y-1 p-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          }
        >
          <SidebarNav />
        </Suspense>

        <div className="border-t p-4 text-xs text-muted-foreground 2xl:p-5 2xl:text-sm">
          <p>Manage all pages from each section.</p>
        </div>
      </aside>

      {/* ── Main content ──────────────────── */}
      <div className="min-w-0 flex-1 md:ml-64 2xl:ml-72">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <span className="truncate text-sm font-bold">Admin Panel</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm hover:bg-accent transition-colors"
              aria-label="View Live Site"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Desktop topbar */}
        <header className="sticky top-0 z-20 hidden h-16 items-center justify-end gap-3 border-b bg-background/95 px-6 backdrop-blur md:flex 2xl:h-20 2xl:px-8 2xl:gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> View Live Site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </header>

        <main className="p-4 sm:p-6 2xl:p-10">{children}</main>
      </div>

      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.2);
          border-radius: 999px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.4);
        }
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--muted-foreground) / 0.2) transparent;
        }
      `}</style>
    </div>
  );
}
