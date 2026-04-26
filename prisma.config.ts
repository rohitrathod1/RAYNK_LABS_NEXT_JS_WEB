import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma v7: connection URL lives here, NOT in schema datasource blocks.
// The pg driver adapter is wired separately in src/lib/db.ts for the runtime client.
export default defineConfig({
  schema: path.join("prisma", "schema"),
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
