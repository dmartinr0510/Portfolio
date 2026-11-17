import type { NextConfig } from "next";

// GITHUB_PAGES=true solo lo pone el workflow de GitHub Pages.
// En local (npm run dev) y en Vercel todo sigue funcionando igual que antes.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/Portfolio" : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages && {
    output: "export", // genera una web estática en /out
    basePath,
    images: { unoptimized: true },
    // GitHub Pages no ejecuta servidor: el formulario usa una versión sin server action.
    turbopack: {
      resolveAlias: { "@/app/actions/contact": "./app/actions/contact.static.ts" },
    },
  }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
