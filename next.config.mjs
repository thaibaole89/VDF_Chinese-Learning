/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No ESLint config shipped with this MVP; never block the build on lint.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
