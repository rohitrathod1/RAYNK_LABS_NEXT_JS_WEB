// prisma/seed.ts — Database seeder
// Run:       npm run db:seed
// Run reset: npm run db:seed:reset

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const isReset = process.argv.includes("--reset");

async function main() {
  console.log("🌱 Seeding database...");

  if (isReset) {
    console.log("⚠️  Resetting — deleting existing data...");
    await prisma.seo.deleteMany();
    await prisma.admin.deleteMany();
    // Add more deleteMany() calls here as models are added
    console.log("✅ Reset complete");
  }

  // ── SEO defaults (one record per public page) ──────────────────────────────
  const seoRecords = [
    { page: "home", title: "RaYnk Labs — Student Innovation Lab", description: "Explore services, projects, software, and courses from RaYnk Labs." },
    { page: "about", title: "About — RaYnk Labs", description: "Learn about the RaYnk Labs team and our mission." },
    { page: "services", title: "Services — RaYnk Labs", description: "Web development, UI/UX design, and more." },
    { page: "projects", title: "Projects — RaYnk Labs", description: "Our portfolio of completed and live projects." },
    { page: "team", title: "Team — RaYnk Labs", description: "Meet the people behind RaYnk Labs." },
    { page: "courses", title: "Courses — RaYnk Labs", description: "Learn with RaYnk Labs — beginner to advanced." },
    { page: "softwares", title: "Software — RaYnk Labs", description: "Software products built by RaYnk Labs." },
    { page: "contact", title: "Contact — RaYnk Labs", description: "Get in touch with RaYnk Labs." },
    { page: "community", title: "Community — RaYnk Labs", description: "Join the RaYnk Labs community." },
    { page: "meetups", title: "Meetups — RaYnk Labs", description: "Events and meetups by RaYnk Labs." },
    { page: "upcoming", title: "Upcoming Projects — RaYnk Labs", description: "See what we are building next." },
  ];

  for (const seo of seoRecords) {
    await prisma.seo.upsert({
      where: { page: seo.page },
      update: {},
      create: seo,
    });
  }
  console.log(`✅ Seeded ${seoRecords.length} SEO records`);

  // ── Super Admin (DB record — env admin is the primary login) ──────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@raynklabs.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@1234";

  const existing = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.admin.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: "SUPER_ADMIN",
        status: "APPROVED",
      },
    });
    console.log(`✅ Created super admin: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
