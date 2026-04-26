// Full NextAuth config — Node runtime ONLY.
// NEVER import this in middleware.ts — use auth.config.ts there.

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Env-based super admin fallback (works before DB is seeded)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          return { id: "env-super-admin", name: "Super Admin", email, role: "SUPER_ADMIN" };
        }

        // DB admin lookup
        const admin = await db.admin.findUnique({ where: { email } });
        if (!admin || admin.status !== "APPROVED") return null;
        if (!(await bcrypt.compare(password, admin.password))) return null;

        return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
      },
    }),
  ],
});
