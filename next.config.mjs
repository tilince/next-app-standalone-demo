/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "standalone",
  outputFileTracingExcludes: {
    "pages/**/*": [".next/cache/webpack/*"],
  },
};

export default nextConfig;
