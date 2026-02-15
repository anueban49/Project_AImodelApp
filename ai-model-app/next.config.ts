import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    GENAI_API_KEY: process.env.GENAI_API_KEY,
  },
};

export default nextConfig;
