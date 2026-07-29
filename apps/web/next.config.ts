import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Monorepo: deps are hoisted to repo root (npm workspaces), not apps/web/node_modules.
const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
  experimental: {
    // Faster dev: cache Turbopack output between restarts.
    turbopackFileSystemCacheForDev: true,
    // Tree-shake large icon/editor packages instead of compiling entire modules.
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-table",
    ],
  },
};

export default nextConfig;
