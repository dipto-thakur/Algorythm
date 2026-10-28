import type { NextConfig } from "next";

const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const imagekitHost = endpoint ? new URL(endpoint).hostname : "ik.imagekit.io";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: imagekitHost }] },
};

export default nextConfig;
