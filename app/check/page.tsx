import Link from "next/link";
import type { Metadata } from "next";
import DeviceCheck from "@/components/DeviceCheck";

export const metadata: Metadata = {
  title: "Kiểm tra micro & loa · VDF Chinese",
  robots: { index: false, follow: false },
};

export default function CheckPage() {
  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Kiểm tra micro & loa</h1>
        <p className="text-sm text-gray-500">
          Chạy trước khi vào phần luyện đọc để biết thiết bị có hoạt động đầy đủ không.
        </p>
      </header>

      <DeviceCheck />
    </div>
  );
}
