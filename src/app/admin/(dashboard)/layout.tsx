"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { SafeImage } from "@/components/common/safe-image";
import { toSrc } from "@/components/common/image-upload";
import {
  Briefcase,
  ChevronDown,
  ExternalLink,
  FileText,
  FolderKanban,
  Globe,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Navigation,
  Newspaper,
  PanelBottom,
  Sun,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { PERMISSIONS } from "@/modules/rbac/constants";
import type { PermissionKey } from "@/modules/rbac/constants";
import { LogoutModal } from "@/components/admin/logout-modal";

interface NavChild {
  title: string;
  href: string;
  icon: React.ElementType;
  query?: string;
  permission: PermissionKey | null;
}

interface NavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  permission: PermissionKey | null;
  children: NavChild[];
}

interface SeoSidebarPage {
  id: string;
  page: string;
  metaTitle: string;
}

interface SidebarProfile {
  name: string;
  email: string;
  role: string;
  imageUrl?: string | null;
}

const CMS_PAGES: NavChild[] = [
  { title: "Home", href: "/admin/home", icon: Home, permission: PERMISSIONS.EDIT_HOME },
  { title: "About", href: "/admin/about", icon: Info, permission: PERMISSIONS.EDIT_ABOUT },
  {
    title: "Services",
    href: "/admin/services",
    icon: Briefcase,
    permission: PERMISSIONS.MANAGE_SERVICES,
  },
  {
    title: "Portfolio",
    href: "/admin/portfolio",
    icon: FolderKanban,
    permission: PERMISSIONS.MANAGE_PORTFOLIO,
  },
  { title: "Blog", href: "/admin/blogs", icon: Newspaper, permission: PERMISSIONS.MANAGE_BLOG },
  { title: "Contact", href: "/admin/contact", icon: Mail, permission: PERMISSIONS.MANAGE_CONTACT },
  {
    title: "Navbar",
    href: "/admin/navbar",
    icon: Navigation,
    permission: PERMISSIONS.MANAGE_NAVBAR,
  },
  {
    title: "Footer",
    href: "/admin/footer",
    icon: PanelBottom,
    permission: PERMISSIONS.MANAGE_FOOTER,
  },
];

const TEAM_PAGES: NavChild[] = [
  { title: "Team Page", href: "/admin/team", icon: Users, permission: PERMISSIONS.MANAGE_TEAM },
  { title: "Users", href: "/admin/users", icon: UserCog, permission: PERMISSIONS.MANAGE_USERS },
  { title: "Profile", href: "/admin/profile", icon: Users, permission: null },
];

function profileInitials(name?: string | null, email?: string | null) {
  const source = name || email || "Admin";
  return source
    .split(/[.\s@_-]+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Dashboard: true,
    SEO: true,
    Team: true,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [seoPages, setSeoPages] = useState<SeoSidebarPage[]>([]);
  const [sidebarProfile, setSidebarProfile] = useState<SidebarProfile | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const userRole = session?.user?.role as string | undefined;
  const rawPermissions = session?.user?.permissions;
  const userPermissions = useMemo(
    () => (Array.isArray(rawPermissions) ? (rawPermissions as string[]) : []),
    [rawPermissions],
  );

  const can = useCallback(
    (permission: PermissionKey | null) => {
      if (!permission) return true;
      if (userRole === "SUPER_ADMIN") return true;
      return userPermissions.includes(permission);
    },
    [userRole, userPermissions],
  );

  const canManageSeo = can(PERMISSIONS.MANAGE_SEO);
  const displayName =
    sidebarProfile?.name ?? session?.user?.name ?? session?.user?.email ?? "Admin";
  const displayEmail = sidebarProfile?.email ?? session?.user?.email ?? "";
  const isSidebarVisible = isDesktop ? sidebarOpen : mobileOpen;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(media.matches);
    const id = window.setTimeout(sync, 0);
    media.addEventListener("change", sync);
    return () => {
      window.clearTimeout(id);
      media.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!session || !canManageSeo) return;
    const id = window.setTimeout(() => {
      fetch("/api/admin/seo", { cache: "no-store" })
        .then((response) => response.json())
        .then((payload: { success?: boolean; data?: SeoSidebarPage[] }) => {
          if (payload.success) setSeoPages(payload.data ?? []);
        })
        .catch(() => setSeoPages([]));
    }, 0);

    return () => window.clearTimeout(id);
  }, [canManageSeo, session]);

  useEffect(() => {
    if (!session) return;
    const id = window.setTimeout(() => {
      fetch("/api/admin/profile", { cache: "no-store" })
        .then((response) => response.json())
        .then((payload: { success?: boolean; data?: SidebarProfile }) => {
          if (payload.success && payload.data) setSidebarProfile(payload.data);
        })
        .catch(() => setSidebarProfile(null));
    }, 0);

    return () => window.clearTimeout(id);
  }, [session]);

  const sidebarSections = useMemo<NavSection[]>(() => {
    const dashboardChildren = CMS_PAGES.filter((page) => can(page.permission));
    const seoChildren = canManageSeo
      ? (seoPages
          .map((seoPage) => {
            const matchingPage = CMS_PAGES.find(
              (page) =>
                page.title.toLowerCase().replace(/\s+/g, "-") === seoPage.page ||
                page.href.endsWith(`/${seoPage.page}`),
            );
            if (matchingPage && !can(matchingPage.permission)) return null;
            return {
              title: seoPage.page.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
              href: "/admin/seo",
              icon: FileText,
              query: `page=${encodeURIComponent(seoPage.page)}`,
              permission: matchingPage?.permission ?? PERMISSIONS.MANAGE_SEO,
            };
          })
          .filter(Boolean) as NavChild[])
      : [];
    const teamChildren = TEAM_PAGES.filter((page) => can(page.permission));

    return [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        permission: null,
        children: dashboardChildren,
      },
      {
        title: "SEO",
        href: "/admin/seo",
        icon: Globe,
        permission: PERMISSIONS.MANAGE_SEO,
        children: seoChildren,
      },
      {
        title: "Team",
        href: teamChildren[0]?.href ?? "/admin/profile",
        icon: Users,
        permission: null,
        children: teamChildren,
      },
    ];
  }, [can, canManageSeo, seoPages]);

  const visibleSections = useMemo(() => {
    return sidebarSections.filter((section) => {
      if (section.children.length === 0 && section.title !== "SEO") return false;
      if (!section.permission) return section.children.length > 0 || section.href === "/admin";
      return can(section.permission);
    });
  }, [can, sidebarSections]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && mobileOpen) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [mobileOpen]);

  const currentQuery = searchParams.toString();
  const isChildActive = (child: NavChild) =>
    pathname === child.href &&
    (child.query ? currentQuery === child.query : !currentQuery || child.href !== "/admin/seo");
  const isActive = (section: NavSection) =>
    pathname === section.href || section.children.some((child) => isChildActive(child));

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <div className="admin-shell bg-background flex h-screen overflow-hidden">
      {mobileOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "border-border bg-card fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r shadow-sm 2xl:w-72",
          "transform transition-all duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          sidebarOpen ? "md:translate-x-0" : "md:-translate-x-full",
        )}
      >
        <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4 2xl:h-20 2xl:px-6">
          <div className="border-border bg-card hidden min-w-0 items-center gap-3 rounded-xl border px-3 py-2 shadow-sm lg:flex">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold">
              {sidebarProfile?.imageUrl ? (
                <SafeImage
                  src={toSrc(sidebarProfile.imageUrl)}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                profileInitials(displayName, displayEmail)
              )}
            </div>
            <div className="min-w-0">
              <p className="max-w-40 truncate text-xs font-bold">{displayName}</p>
              <p className="text-muted-foreground max-w-40 truncate text-[11px]">{displayEmail}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            title={isSidebarVisible ? "Collapse sidebar" : "Open sidebar"}
            onClick={() => {
              if (isDesktop) {
                setSidebarOpen((open) => !open);
              } else {
                setMobileOpen((open) => !open);
              }
            }}
            className="border-border hover:border-primary/50 hover:bg-primary/10 h-10 w-10 shrink-0 cursor-pointer rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
          >
            {isSidebarVisible ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto p-3">
          {visibleSections.map((section) => {
            const active = isActive(section);
            const isOpen = expanded[section.title] ?? false;
            const Icon = section.icon;

            return (
              <div key={section.title}>
                <div
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-primary/20 shadow-lg"
                      : "text-foreground/75 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Link
                    href={section.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex min-h-11 flex-1 cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-semibold 2xl:px-4 2xl:py-3 2xl:text-base"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition",
                        active
                          ? "bg-background/15"
                          : "group-hover:bg-primary/10 group-hover:text-primary bg-transparent",
                      )}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="truncate">{section.title}</span>
                  </Link>
                  {section.children.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => ({ ...prev, [section.title]: !isOpen }))}
                      className="flex min-h-11 w-10 cursor-pointer items-center justify-center"
                      aria-label={isOpen ? `Collapse ${section.title}` : `Expand ${section.title}`}
                    >
                      <ChevronDown
                        size={16}
                        className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                      />
                    </button>
                  )}
                </div>

                {section.children.length > 0 && (
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="no-scrollbar border-border ml-5 max-h-72 overflow-y-auto border-l py-1 pl-3">
                      {section.children.map((child) => {
                        const ChildIcon = child.icon;
                        const href = child.query ? `${child.href}?${child.query}` : child.href;
                        const childActive = isChildActive(child);
                        return (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition",
                              childActive
                                ? "bg-primary/15 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                            )}
                          >
                            <ChildIcon size={14} />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {visibleSections.length === 0 && (
            <div className="text-muted-foreground p-4 text-center text-sm">
              You don&apos;t have access to any modules
            </div>
          )}
        </nav>

        <div className="border-border text-muted-foreground shrink-0 border-t p-4 text-xs 2xl:p-5 2xl:text-sm">
          <p>Manage all pages from sidebar.</p>
        </div>
      </aside>

      <div
        className={cn(
          "flex h-screen min-w-0 flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "md:ml-64 2xl:ml-72" : "md:ml-0",
        )}
      >
        <header className="border-border bg-background/95 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 backdrop-blur 2xl:h-20 2xl:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3"></div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              title="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="border-border hover:border-primary/50 hover:bg-primary/10 h-10 w-10 cursor-pointer rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-border hover:border-primary/50 hover:bg-primary/10 hidden h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 sm:inline-flex"
            >
              <ExternalLink className="h-4 w-4" /> View Site
            </a>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowLogoutModal(true)}
              className="h-10 cursor-pointer gap-2 rounded-xl px-4 transition-all hover:opacity-90"
            >
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 2xl:p-10">
          {children}
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
