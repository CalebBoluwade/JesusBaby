import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["bun:sqlite"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // If you are using Webpack (default), this fallback ensures safety:
  // webpack: (config) => {
  //   config.externals.push({
  //     "bun:sqlite": "commonjs bun:sqlite",
  //   });
  //   return config;
  // },
};

export default nextConfig;
