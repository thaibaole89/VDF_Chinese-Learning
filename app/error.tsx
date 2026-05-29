"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="space-y-3 py-12 text-center">
      <div className="text-4xl">⚠️</div>
      <h1 className="text-lg font-semibold text-ink">Đã có lỗi xảy ra</h1>
      <p className="text-sm text-gray-500">
        Xin thử lại. Nếu vẫn lỗi, hãy báo cho người phụ trách nội dung.
      </p>
      <button
        onClick={() => reset()}
        className="inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white tap"
      >
        Thử lại
      </button>
    </div>
  );
}
