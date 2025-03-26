import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.needpix.com" },
      { protocol: "https", hostname: "cloud.appwrite.io" },
    ],
  },
};

export default nextConfig;
