import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow file system writes in API routes (dev only - for CMS)
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  turbopack: {
    // Allow writes for CMS functionality
    resolveAlias: {},
  },
};

export default nextConfig;
