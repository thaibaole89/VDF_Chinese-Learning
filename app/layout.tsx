import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

// Vietnamese-designed typeface — full diacritic coverage + character. Exposed as
// a CSS variable so Tailwind's `font-sans` (see tailwind.config.ts) picks it up.
const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

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
  // Internal pilot preview — never let search engines index this.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: "#002e76",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// No-FOUC theme init: set <html class="dark"> BEFORE paint, based on the saved
// preference (default "auto" → dark 18:00–06:00). Must stay in sync with
// lib/theme.resolveDark(). Inlined so it runs before React hydrates.
const THEME_INIT = `(function(){try{var p=localStorage.getItem('vdf_theme');if(p!=='light'&&p!=='dark'&&p!=='auto')p='auto';var h=new Date().getHours();var d=p==='dark'||(p==='auto'&&(h>=18||h<6));document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={fontSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {/* Internal-preview banner — shown on every route, in normal flow so it
            never covers the bottom nav. */}
        <div className="bg-amber-100 px-4 py-1.5 text-center text-[11px] font-medium leading-tight text-amber-900 ring-1 ring-amber-200 print:hidden">
          Bản xem nội bộ — nội dung đang chờ duyệt trước khi đào tạo chính thức.
        </div>
        <div className="mx-auto max-w-screen-sm px-4 pb-24 pt-4">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
