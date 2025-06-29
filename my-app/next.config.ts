import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ allow deploy even if ESLint has errors
  },
};

export default nextConfig;
