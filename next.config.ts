import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['apify-client', 'pdfjs-dist'],
};

export default nextConfig;
