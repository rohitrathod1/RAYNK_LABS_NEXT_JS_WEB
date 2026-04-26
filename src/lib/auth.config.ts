// Edge-safe NextAuth config — used by middleware.ts (Edge Runtime).
// NEVER import bcrypt, Prisma, or any Node.js-only module here.
// Full Node config with Credentials provider is in auth.ts.

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [],
  callbacks: {
    // Attach id + role to JWT on sign-in
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }
      return token;
    },
    // Expose id + role on session object (accessible via useSession / auth())
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    // Called by middleware to authorize requests
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
      const { pathname } = request.nextUrl;
      const isPublic = !pathname.startsWith("/admin") || pathname === "/admin/login";
      if (isPublic) return true;
      return isLoggedIn && isAdmin;
    },
  },
};
