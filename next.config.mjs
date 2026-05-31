/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No ESLint config shipped with this MVP; never block the build on lint.
  eslint: { ignoreDuringBuilds: true },
  // No sharp/WebP tooling in this environment; serve the (already small) PNG
  // visual placeholders as-is. next/image still gives lazy-loading + sizes.
  images: { unoptimized: true },
  // Internal pilot preview — also send X-Robots-Tag on every response so even
  // non-HTML routes (api / images / etc.) are excluded from search indices.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
