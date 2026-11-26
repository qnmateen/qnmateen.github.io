import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Loaded from node_modules while pages are prerendered. Bundling them
  // breaks gray-matter's filesystem use and Shiki's grammars.
  serverExternalPackages: ["gray-matter", "shiki", "@shikijs/rehype"],
};

export default nextConfig;
