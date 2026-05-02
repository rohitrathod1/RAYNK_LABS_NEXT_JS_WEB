import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { Providers } from "@/providers";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { AdminCheck } from "@/components/admin-check";
import { Footer } from "@/components/footer";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = localFont({
  variable: "--font-geist-sans",
  src: [
    { path: "../../public/fonts/Jost-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Jost-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Jost-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Jost-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Jost-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  display: "swap",
});

const geistMono = localFont({
  variable: "--font-geist-mono",
  src: "../../public/fonts/Jost-Regular.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Raynk Labs — Building the future, one line at a time.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "/";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {!isAdminRoute && <AdminCheck pathname={pathname} />}
          {children}
          {!isAdminRoute && <Footer />}
          <Toaster richColors closeButton position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
