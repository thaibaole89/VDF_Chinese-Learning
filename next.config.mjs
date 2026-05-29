/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No ESLint config shipped with this MVP; never block the build on lint.
  eslint: { ignoreDuringBuilds: true },
  // No sharp/WebP tooling in this environment; serve the (already small) PNG
  // visual placeholders as-is. next/image still gives lazy-loading + sizes.
  images: { unoptimized: true },
};

export default nextConfig;
