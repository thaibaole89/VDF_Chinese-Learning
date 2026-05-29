import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 py-12 text-center">
      <div className="text-4xl">🔍</div>
      <h1 className="text-lg font-semibold text-ink">Không tìm thấy trang</h1>
      <p className="text-sm text-gray-500">Nội dung bạn tìm không tồn tại hoặc đã được di chuyển.</p>
      <Link
        href="/"
        className="inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white tap"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
