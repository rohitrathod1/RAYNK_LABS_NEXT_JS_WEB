// Prisma client singleton.
// Prevents connection pool exhaustion from Next.js HMR recreating modules in dev.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { db: PrismaClient };

function resolveSslConfig(connectionString: string | undefined) {
  if (!connectionString) return undefined;

  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

    if (sslMode === "disable" || localHosts.has(url.hostname)) {
      return false;
    }
  } catch {
    return undefined;
  }

  return { rejectUnauthorized: true };
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString,
    ssl: resolveSslConfig(connectionString),
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db: PrismaClient = globalForPrisma.db ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
