/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "standalone",
  outputFileTracingExcludes: {
    "pages/**/*": ["./un-necessary-folder/**/*"],
  },
};

export default nextConfig;
