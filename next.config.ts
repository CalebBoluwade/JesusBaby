import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["bun:sqlite"],

  // If you are using Webpack (default), this fallback ensures safety:
  // webpack: (config) => {
  //   config.externals.push({
  //     "bun:sqlite": "commonjs bun:sqlite",
  //   });
  //   return config;
  // },
};

export default nextConfig;
