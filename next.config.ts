import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-paper-viewer",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
