import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
    ],
  },
  turbopack: {
    // Explicit root to silence multiple lockfile warning from Turbopack
    root: __dirname,
  },
};

export default nextConfig;
