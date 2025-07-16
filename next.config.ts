import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("bun:ffi");
      config.resolve.alias = {
        ...config.resolve.alias,
        "bun:ffi": false, // This tells webpack to ignore it
      };
    }
    return config;
  },
};

export default nextConfig;
