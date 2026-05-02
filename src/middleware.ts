import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { localRateLimit, isAuthBlocked } from "@/lib/rate-limit-local";
import type { Session } from "next-auth";

const { auth } = NextAuth(authConfig);

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function addSecurityHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  return res;
}

function nextWithPath(req: NextRequest): NextResponse {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-invoke-path", req.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

type AuthRequest = NextRequest & { auth: Session | null };

export default auth(async (req: AuthRequest) => {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // ── Route classification ───────────────────────────────────────────
  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAuthApi = pathname.startsWith("/api/auth/");
  const isAdminApi = pathname.startsWith("/api/admin/") || pathname === "/api/upload";
  const isApiRoute = pathname.startsWith("/api/");
  const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

  const ip = clientIp(req);

  // ── 1. Rate limiting ─────────────────────────────────────────────
  if (isAuthApi && isMutation) {
    const result = localRateLimit.auth(ip);
    if (!result.allowed) {
      const proto =
        req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
      const host = req.headers.get("host") ?? req.nextUrl.host;
      return addSecurityHeaders(
        NextResponse.json(
          { url: `${proto}://${host}/` },
          { status: 429, headers: { "Retry-After": String(result.retryAfter) } },
        ),
      );
    }
  } else if ((isAdminApi || isAdminPage) && isMutation) {
    const limiter = pathname === "/api/upload" ? localRateLimit.upload : localRateLimit.admin;
    const result = limiter(ip);
    if (!result.allowed) {
      return addSecurityHeaders(
        NextResponse.json(
          { success: false, error: "Too many requests" },
          { status: 429, headers: { "Retry-After": String(result.retryAfter) } },
        ),
      );
    }
  }

  // ── 2. CSRF origin check for all API mutations ─────────────────────────
  if (isApiRoute && !isAuthApi && isMutation) {
    const origin = req.headers.get("origin");
    if (origin) {
      const host = req.headers.get("host") ?? "";
      let originHost: string;
      try {
        originHost = new URL(origin).host;
      } catch {
        return addSecurityHeaders(
          NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
        );
      }
      if (originHost !== host) {
        return addSecurityHeaders(
          NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
        );
      }
    }
  }

  // ── 3. Auth + role enforcement ─────────────────────────────────────
  const needsAuth =
    isAdminPage || isAdminApi || (isApiRoute && isMutation && !isAuthApi);

  if (!needsAuth) {
    return addSecurityHeaders(nextWithPath(req));
  }

  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const permissions = (session?.user?.permissions as string[]) || [];

  // ── 3a. Admin pages — redirect flow ───────────────────────────────
  if (isAdminPage) {
    if (!isLoggedIn && isAuthBlocked(ip)) {
      return addSecurityHeaders(NextResponse.redirect(new URL("/?blocked=1", req.url)));
    }

    if (!isLoginPage && !isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      const proto =
        req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
      const host = req.headers.get("host") ?? req.nextUrl.host;
      url.searchParams.set("callbackUrl", `${proto}://${host}${pathname}`);
      return addSecurityHeaders(NextResponse.redirect(url));
    }

    if (!isLoginPage && isLoggedIn && !isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "AccessDenied");
      return addSecurityHeaders(NextResponse.redirect(url));
    }

    if (isLoginPage && isLoggedIn && isAdmin) {
      return addSecurityHeaders(NextResponse.redirect(new URL("/admin", req.url)));
    }

    // ── 3c. Page-level permission checks ──────────────────────────
    const pagePermissions: Record<string, string> = {
      "/admin/dashboard/home": "EDIT_HOME",
      "/admin/dashboard/about": "EDIT_ABOUT",
      "/admin/dashboard/services": "MANAGE_SERVICES",
      "/admin/dashboard/portfolio": "MANAGE_PORTFOLIO",
      "/admin/dashboard/blogs": "MANAGE_BLOG",
      "/admin/dashboard/team": "MANAGE_TEAM",
      "/admin/dashboard/contact": "MANAGE_CONTACT",
      "/admin/dashboard/navbar": "MANAGE_NAVBAR",
      "/admin/dashboard/footer": "MANAGE_FOOTER",
      "/admin/footer": "MANAGE_FOOTER",
      "/admin/dashboard/seo": "MANAGE_SEO",
      "/admin/dashboard/users": "MANAGE_USERS",
    };

    for (const [path, perm] of Object.entries(pagePermissions)) {
      if (pathname.startsWith(path)) {
        if (role !== "SUPER_ADMIN" && !permissions.includes(perm)) {
          return addSecurityHeaders(
            NextResponse.redirect(new URL("/admin", req.url)),
          );
        }
        break;
      }
    }

    return addSecurityHeaders(nextWithPath(req));
  }

  // ── 3b. Admin API routes — JSON responses ─────────────────────────
  if (!isLoggedIn) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
    );
  }
  if (!isAdmin) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
    );
  }

  return addSecurityHeaders(nextWithPath(req));
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/upload",
    // Add public-GET / admin-mutation routes here as they are built:
    // "/api/home/:path*",
    // "/api/hero-slides/:path*",
    "/api/auth/:path*",
  ],
};
