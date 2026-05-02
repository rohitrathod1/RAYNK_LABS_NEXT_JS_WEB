import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      dns: false,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },

  // Turbopack handles node: protocol imports natively
  turbopack: {},

  images: {
    // Allow /api/uploads/* with and without the ?_r= cache-buster query string
    localPatterns: [
      { pathname: "/api/uploads/**", search: "" },
      { pathname: "/api/uploads/**", search: "**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "@tanstack/react-query", "framer-motion"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    if (isProd) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      });
    }

    const routes = [{ source: "/(.*)", headers: securityHeaders }];

    if (isProd) {
      routes.push(
        {
          source: "/_next/static/(.*)",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
        {
          source: "/api/uploads/(.*)",
          headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" }],
        },
      );
    }

    return routes;
  },
};

export default nextConfig;
