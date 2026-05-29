import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  applicationName: "VDF Chinese",
  title: { default: "VDF Chinese Sales Tutor", template: "%s · VDF Chinese" },
  description: "Tiếng Trung dùng ngay tại quầy duty-free cho nhân viên VDF.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "VDF Chinese" },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon-192.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#002e76",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen">
        {/* Internal-preview banner — shown on every route, in normal flow so it
            never covers the bottom nav. */}
        <div className="bg-amber-100 px-4 py-1.5 text-center text-[11px] font-medium leading-tight text-amber-900 ring-1 ring-amber-200">
          Bản xem nội bộ — nội dung đang chờ duyệt trước khi đào tạo chính thức.
        </div>
        <div className="mx-auto max-w-screen-sm px-4 pb-24 pt-4">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
