import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Monorepo: deps are hoisted to repo root (npm workspaces), not apps/web/node_modules.
const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
