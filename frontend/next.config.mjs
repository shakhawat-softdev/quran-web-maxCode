import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable optimizations
  compress: true,
  // Turbopack configuration
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@": "./",
    },
  },
  // Disable static export for now to support dynamic features
  // output: 'standalone',
};

export default nextConfig;
