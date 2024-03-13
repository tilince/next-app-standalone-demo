/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "standalone",
  experimental: {
    outputFileTracingExcludes: {
      "pages/**/*": [".next/cache/webpack/*"],
    },
  },
};

export default nextConfig;
