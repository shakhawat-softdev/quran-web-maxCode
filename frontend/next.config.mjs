/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable optimizations
  compress: true,
  // Experimental features for Tailwind CSS v4
  experimental: {
    turbo: {
      resolveAlias: {
        '@': './',
      },
    },
  },
  // Disable static export for now to support dynamic features
  // output: 'standalone',
};

export default nextConfig;