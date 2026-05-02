'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import {
  Menu,
  X,
  LayoutDashboard,
  Home,
  Sparkles,
  Package,
  Newspaper,
  Users,
  Globe,
  Navigation,
  PanelBottom,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Moon,
  Sun,
  ExternalLink,
  UserCog,
  FolderOpen,
  MessageSquare,
} from 'lucide-react';
import { PERMISSIONS } from '@/modules/rbac/constants';
import type { PermissionKey } from '@/modules/rbac/constants';
import { LogoutModal } from '@/components/admin/logout-modal';

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
  permission: PermissionKey | null;
  children: NavChild[];
}

const SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    permission: null,
    children: [],
  },
  {
    title: 'Profile',
    href: '/admin/profile',
    icon: Users,
    permission: null,
    children: [],
  },
  {
    title: 'Home',
    href: '/admin/home',
    icon: Home,
    permission: PERMISSIONS.EDIT_HOME,
    children: [],
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: Sparkles,
    permission: PERMISSIONS.MANAGE_SERVICES,
    children: [],
  },
  {
    title: 'Portfolio',
    href: '/admin/portfolio',
    icon: FolderOpen,
    permission: PERMISSIONS.MANAGE_PORTFOLIO,
    children: [],
  },
  {
    title: 'Blog',
    href: '/admin/blogs',
    icon: Newspaper,
    permission: PERMISSIONS.MANAGE_BLOG,
    children: [],
  },
  {
    title: 'Team',
    href: '/admin/team',
    icon: Users,
    permission: PERMISSIONS.MANAGE_TEAM,
    children: [],
  },
  {
    title: 'Contact',
    href: '/admin/contact',
    icon: MessageSquare,
    permission: PERMISSIONS.MANAGE_CONTACT,
    children: [],
  },
  {
    title: 'Navbar',
    href: '/admin/navbar',
    icon: Navigation,
    permission: PERMISSIONS.MANAGE_NAVBAR,
    children: [],
  },
  {
    title: 'Footer',
    href: '/admin/footer',
    icon: PanelBottom,
    permission: PERMISSIONS.MANAGE_FOOTER,
    children: [],
  },
  {
    title: 'SEO',
    href: '/admin/seo',
    icon: Globe,
    permission: PERMISSIONS.MANAGE_SEO,
    children: [],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: UserCog,
    permission: PERMISSIONS.MANAGE_USERS,
    children: [],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const userRole = session?.user?.role as string | undefined;
  const userPermissions = (session?.user?.permissions as string[]) || [];

  const visibleSections = useMemo(() => {
    return SIDEBAR_SECTIONS.filter((section) => {
      if (!section.permission) return true;
      if (userRole === 'SUPER_ADMIN') return true;
      return userPermissions.includes(section.permission);
    });
  }, [userRole, userPermissions]);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && mobileOpen) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [mobileOpen]);

  const toggle = useCallback((key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ───────────────────────────── */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card shadow-sm 2xl:w-72',
          'transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-64',
          'md:translate-x-0',
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-6 2xl:h-20 2xl:px-8">
          <Link href="/" title="Back to Website">
            <ArrowLeft size={20} className="cursor-pointer hover:text-primary 2xl:h-6 2xl:w-6" />
          </Link>
          <span className="text-lg font-bold 2xl:text-xl">Admin Panel</span>
          <button onClick={() => setMobileOpen(false)} className="cursor-pointer md:hidden" aria-label="Close sidebar">
            <X size={20} />
          </button>
          <div className="hidden w-5 md:block" />
        </div>

        {/* Nav */}
        <nav className="sidebar-scroll flex-1 space-y-0.5 overflow-y-auto p-3">
          {visibleSections.map((section) => {
            const active = isActive(section.href);
            const isOpen = expanded[section.title] ?? false;
            const Icon = section.icon;

            return (
              <div key={section.title}>
                <Link
                  href={section.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition 2xl:px-4 2xl:py-3 2xl:text-base',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="truncate">{section.title}</span>
                </Link>
              </div>
            );
          })}

          {visibleSections.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              🚫 You don't have access to any modules
            </div>
          )}
        </nav>

        <div className="border-t p-4 text-xs text-muted-foreground 2xl:p-5 2xl:text-sm">
          <p>Manage all pages from sidebar.</p>
        </div>
      </aside>

      {/* ── Main content ──────────────────────── */}
      <div className="min-w-0 flex-1 md:ml-64 2xl:ml-72">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-background/95 px-4 backdrop-blur md:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="cursor-pointer" aria-label="Open menu">
              <Menu size={24} />
            </button>
            <h1 className="truncate text-sm font-bold">Admin Panel</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-9 w-9 rounded-lg border border-white/20 hover:border-blue-500 transition-all duration-200">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button asChild variant="outline" size="sm" className="h-9 gap-2 rounded-lg border border-white/20 hover:border-blue-500 transition-all duration-200 px-3 text-xs">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> <span className="hidden sm:inline">View Site</span>
              </a>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowLogoutModal(true)} className="h-9 gap-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 px-3 text-xs">
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <header className="sticky top-0 z-20 hidden h-16 items-center justify-end gap-3 border-b border-white/10 bg-background/95 px-6 backdrop-blur md:flex 2xl:h-20 2xl:px-8 2xl:gap-4">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-10 w-10 rounded-lg border border-white/20 hover:border-blue-500 transition-all duration-200">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild variant="outline" size="sm" className="h-10 rounded-lg gap-2 border-white/20 hover:border-blue-500 transition-all duration-200 px-4">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> View Site
            </a>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowLogoutModal(true)} className="h-10 gap-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 px-4">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </header>

        <main className="p-4 sm:p-6 2xl:p-10">{children}</main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

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
