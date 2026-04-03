import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/baseline": ["./src/models/**/*.onnx"],
  },
  serverExternalPackages: ["onnxruntime-node"],
  images: {
    // Allows profile images returned by common OAuth providers.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
