import Link from "next/link";
import type { Metadata } from "next";
import { APP_VERSION_LABEL, APP_VERSION_DATE } from "@/lib/version";

export const metadata: Metadata = {
  title: "Giới thiệu · Bản xem nội bộ",
  robots: { index: false, follow: false },
};

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">{children}</div>;
}

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Giới thiệu</h1>
        <p className="text-sm text-gray-500">VDF Chinese Sales Tutor — bản xem nội bộ.</p>
      </header>

      <Card>
        <h2 className="font-semibold text-ink">📍 Bản xem nội bộ</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
          <li>• <strong>Nội dung đang chờ duyệt</strong> — các câu gắn nhãn “Chờ duyệt” / “Cần xác nhận” chưa phải bản chính thức.</li>
          <li>• Dùng cho <strong>pilot training nội bộ VDF</strong>, 5–10 nhân viên thử nghiệm.</li>
          <li>• <strong>Không share link ra ngoài nhóm pilot.</strong></li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-ink">🎤 Về tính năng luyện đọc</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
          <li>• Voice recognition chỉ <strong>hỗ trợ luyện tập</strong>, <strong>chưa phải chấm phát âm chính thức</strong>.</li>
          <li>• <strong>Không lưu file ghi âm</strong> — chỉ lưu kết quả nhận diện trên thiết bị này.</li>
          <li>• Hoạt động tốt nhất trên Chrome / Edge / Android Chrome. iOS Safari có thể chưa hỗ trợ → dùng nút “Đánh dấu đã đọc được”.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-ink">💾 Về tiến độ học</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
          <li>• <strong>Progress hiện lưu trên thiết bị này</strong> (localStorage của trình duyệt).</li>
          <li>• Xoá lịch sử trình duyệt = mất tiến độ.</li>
          <li>• App chưa có tài khoản / chứng chỉ chính thức — sẽ làm ở Phase 2 sau khi pilot ổn.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-ink">📝 Phản hồi</h2>
        <p className="mt-2 text-sm text-gray-700">
          Gặp lỗi / có góp ý? Liên hệ trưởng nhóm pilot, hoặc điền mẫu <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">FEEDBACK_FORM.md</code> đính kèm trong gói pilot.
        </p>
      </Card>

      <div className="pt-2 text-center text-[11px] text-gray-400">
        {APP_VERSION_LABEL} · {APP_VERSION_DATE}
      </div>
    </div>
  );
}
