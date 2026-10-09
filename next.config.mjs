/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@google/generative-ai"],
  },
};

export default nextConfig;
