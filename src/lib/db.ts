// Prisma client singleton.
// Prevents connection pool exhaustion from Next.js HMR recreating modules in dev.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { db: PrismaClient };

function normalizeDatabaseUrl(connectionString: string | undefined): string | undefined {
  if (!connectionString) return connectionString;

  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");
    if (sslMode && ["prefer", "require", "verify-ca"].includes(sslMode)) {
      url.searchParams.set("sslmode", "verify-full");
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}

function createPrismaClient(): PrismaClient {
  const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL);
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: true }, // explicit verify-full — silences pg deprecation warning
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db: PrismaClient = globalForPrisma.db ?? createPrismaClient();
export const prisma = db;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
