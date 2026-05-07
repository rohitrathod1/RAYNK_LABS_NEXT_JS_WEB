// prisma/seed.ts — Database seeder
// Run:       npm run db:seed
// Run reset: npm run db:seed:reset

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const isReset = process.argv.includes("--reset");

async function main() {
  console.log("🌱 Seeding database...");

  if (isReset) {
    console.log("⚠️  Resetting — deleting existing data...");
    await prisma.userPermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.seoMeta.deleteMany();
    await prisma.footerLink.deleteMany();
    await prisma.footerColumn.deleteMany();
    await prisma.footerSetting.deleteMany();
    await prisma.admin.deleteMany();
    // Add more deleteMany() calls here as models are added
    console.log("✅ Reset complete");
  }

  // ── Permissions (RBAC) ─────────────────────────────────────────────────────
  const permissionNames = [
    { name: "EDIT_HOME", description: "Edit home page content" },
    { name: "EDIT_ABOUT", description: "Edit about page content" },
    { name: "MANAGE_SERVICES", description: "Manage services section" },
    { name: "MANAGE_PORTFOLIO", description: "Manage portfolio/projects" },
    { name: "MANAGE_BLOG", description: "Manage blog posts" },
    { name: "MANAGE_TEAM", description: "Manage team members" },
    { name: "MANAGE_CONTACT", description: "Manage contact forms" },
    { name: "MANAGE_NAVBAR", description: "Manage navigation bar" },
    { name: "MANAGE_FOOTER", description: "Manage footer content" },
    { name: "MANAGE_SEO", description: "Manage SEO settings" },
    { name: "MANAGE_USERS", description: "Manage admin users and permissions" },
  ];

  for (const perm of permissionNames) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }
  console.log(`✅ Seeded ${permissionNames.length} permissions`);

  // ── Super Admin (DB record — env admin is the primary login) ──────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@raynklabs.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@1234";

  // Grant all permissions to the super admin
  const superAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (superAdmin) {
    const allPerms = await prisma.permission.findMany();
    for (const perm of allPerms) {
      await prisma.userPermission.upsert({
        where: {
          userId_permissionId: { userId: superAdmin.id, permissionId: perm.id },
        },
        update: {},
        create: { userId: superAdmin.id, permissionId: perm.id },
      });
    }
    console.log(`✅ Granted all permissions to super admin`);
  }

  // ── SEO defaults (one record per public page) ──────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const seoRecords = [
    {
      page: "home",
      metaTitle: "RaYnk Labs - Digital Solutions & Innovation",
      metaDescription: "RaYnk Labs builds websites, software, branding, and digital products that help businesses grow with modern technology.",
      keywords: ["raynk labs", "digital solutions", "web development", "software development", "tech innovation"],
      canonicalUrl: baseUrl,
    },
    {
      page: "about",
      metaTitle: "About RaYnk Labs - Story, Mission & Team",
      metaDescription: "Learn about RaYnk Labs, our story, mission, values, and the team building practical digital innovation for growing businesses.",
      keywords: ["about raynk labs", "digital agency", "tech team", "company story"],
      canonicalUrl: `${baseUrl}/about`,
    },
    {
      page: "services",
      metaTitle: "Digital Services - RaYnk Labs",
      metaDescription: "Explore RaYnk Labs services across web design, SEO optimization, graphic design, software development, and digital consulting.",
      keywords: ["web design", "seo", "graphic design", "digital services", "raynk labs"],
      canonicalUrl: `${baseUrl}/services`,
    },
    {
      page: "portfolio",
      metaTitle: "Portfolio - RaYnk Labs Projects & Work",
      metaDescription: "Explore RaYnk Labs portfolio featuring web development, design, SEO, and software projects created for real business outcomes.",
      keywords: ["raynk labs portfolio", "web development projects", "case studies", "digital work"],
      canonicalUrl: `${baseUrl}/portfolio`,
    },
    {
      page: "team",
      metaTitle: "Our Team - RaYnk Labs",
      metaDescription: "Meet the founders, developers, designers, and collaborators behind RaYnk Labs and the values that guide our work.",
      keywords: ["raynk labs team", "developers", "designers", "tech team"],
      canonicalUrl: `${baseUrl}/team`,
    },
    {
      page: "blog",
      metaTitle: "Blog - RaYnk Labs Insights",
      metaDescription: "Read RaYnk Labs insights on web development, design, SEO, software, technology trends, and digital growth.",
      keywords: ["raynk labs blog", "web development blog", "seo insights", "technology articles"],
      canonicalUrl: `${baseUrl}/blog`,
    },
    {
      page: "contact",
      metaTitle: "Contact RaYnk Labs - Start Your Project",
      metaDescription: "Contact RaYnk Labs to discuss websites, software, branding, SEO, or digital product ideas for your business.",
      keywords: ["contact raynk labs", "project inquiry", "web development contact", "digital agency contact"],
      canonicalUrl: `${baseUrl}/contact`,
    },
  ];

  for (const seo of seoRecords) {
    await prisma.seoMeta.upsert({
      where: { page: seo.page },
      update: {},
      create: {
        ...seo,
        ogTitle: seo.metaTitle,
        ogDescription: seo.metaDescription,
        ogImage: "og-default.png",
        twitterCard: "summary_large_image",
        robots: "index,follow",
        structuredData: {
          "@type": seo.page === "home" ? "WebSite" : "WebPage",
          name: seo.metaTitle,
          url: seo.canonicalUrl,
        },
      },
    });
  }
  console.log(`✅ Seeded ${seoRecords.length} SEO records`);

  const footerColumns = [
    {
      title: "COMPANY",
      sortOrder: 0,
      links: [
        { title: "About", href: "/about" },
        { title: "Team", href: "/team" },
        { title: "Portfolio", href: "/portfolio" },
        { title: "Blog", href: "/blog" },
      ],
    },
    {
      title: "SERVICES",
      sortOrder: 1,
      links: [
        { title: "Web Design", href: "/services" },
        { title: "SEO Optimization", href: "/services" },
        { title: "Graphic Design", href: "/services" },
        { title: "Software Development", href: "/services" },
      ],
    },
    {
      title: "RESOURCES",
      sortOrder: 2,
      links: [
        { title: "Case Studies", href: "/portfolio" },
        { title: "Insights", href: "/blog" },
        { title: "Contact", href: "/contact" },
      ],
    },
    {
      title: "CONNECT",
      sortOrder: 3,
      links: [
        { title: "Start a Project", href: "/contact" },
        { title: "Careers", href: "/contact" },
        { title: "Support", href: "/contact" },
      ],
    },
    {
      title: "QUICK LINKS",
      sortOrder: 4,
      links: [
        { title: "Home", href: "/" },
        { title: "Privacy Policy", href: "/privacy-policy" },
        { title: "Terms & Conditions", href: "/terms-and-conditions" },
      ],
    },
  ];

  if (isReset) {
    for (const col of footerColumns) {
      const c = await prisma.footerColumn.create({
        data: { title: col.title, sortOrder: col.sortOrder, isVisible: true },
      });
      await prisma.footerLink.createMany({
        data: col.links.map((link, i) => ({
          columnId: c.id,
          title: link.title,
          href: link.href,
          sortOrder: i,
          isVisible: true,
        })),
      });
    }
    console.log(`Footer: RESET (${footerColumns.length} columns)`);
  } else {
    const colCount = await prisma.footerColumn.count();
    if (colCount === 0) {
      for (const col of footerColumns) {
        const c = await prisma.footerColumn.create({
          data: { title: col.title, sortOrder: col.sortOrder, isVisible: true },
        });
        await prisma.footerLink.createMany({
          data: col.links.map((link, i) => ({
            columnId: c.id,
            title: link.title,
            href: link.href,
            sortOrder: i,
            isVisible: true,
          })),
        });
      }
      console.log(`Footer: ${footerColumns.length} columns created (table was empty)`);
    } else {
      console.log(`Footer: skipped (${colCount} columns already exist)`);
    }
  }

  const footerSetting = await prisma.footerSetting.findUnique({ where: { id: "default" } });
  if (!footerSetting || isReset) {
    await prisma.footerSetting.upsert({
      where: { id: "default" },
      update: isReset
        ? {
            logoUrl: "placeholder.png",
            logoAlt: "RaYnk Labs",
            copyrightText: `All Right Reserved © ${new Date().getFullYear()}`,
            address: "India",
            email: "hello@raynklabs.com",
            phone: "+91 98765 43210",
            phoneLabel: "(Support)",
          }
        : {},
      create: {
        id: "default",
        logoUrl: "placeholder.png",
        logoAlt: "RaYnk Labs",
        copyrightText: `All Right Reserved © ${new Date().getFullYear()}`,
        address: "India",
        email: "hello@raynklabs.com",
        phone: "+91 98765 43210",
        phoneLabel: "(Support)",
      },
    });
    console.log(`Footer settings: ${isReset ? "RESET" : "created"}`);
  } else {
    console.log("Footer settings: skipped (already exist)");
  }

  // ── Create Super Admin if not exists ──────────────────────────────────────
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
