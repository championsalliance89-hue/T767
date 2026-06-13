/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow reading from /outputs at build time
  output: "standalone",
};

module.exports = nextConfig;
