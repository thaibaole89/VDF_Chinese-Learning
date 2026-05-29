import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  applicationName: "VDF Chinese",
  title: { default: "VDF Chinese Sales Tutor", template: "%s · VDF Chinese" },
  description: "Tiếng Trung dùng ngay tại quầy duty-free cho nhân viên VDF.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "VDF Chinese" },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen">
        <div className="mx-auto max-w-screen-sm px-4 pb-24 pt-4">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
