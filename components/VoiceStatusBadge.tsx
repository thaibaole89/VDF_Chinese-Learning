import type { VoiceScoreResult } from "@/lib/voiceScoring";

const MAP: Record<string, { label: string; cls: string }> = {
  pass: { label: "Đạt", cls: "bg-green-100 text-green-800" },
  near: { label: "Gần đúng", cls: "bg-amber-100 text-amber-800" },
  retry: { label: "Cần luyện thêm", cls: "bg-orange-100 text-orange-800" },
  manual: { label: "Tự đánh dấu đã luyện", cls: "bg-brand-100 text-brand-700" },
  unsupported: { label: "Không hỗ trợ", cls: "bg-gray-100 text-gray-500" },
};

export default function VoiceStatusBadge({ result }: { result?: VoiceScoreResult }) {
  if (!result) return null;
  const m = MAP[result];
  if (!m) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${m.cls}`}>
      {m.label}
    </span>
  );
}
