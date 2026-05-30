import type { VoicePracticeStore } from "@/lib/types";

// Soft Day-One voice recommendation: target of `target` passed/manual out of total.
export default function VoiceGateSummary({
  phraseIds,
  records,
  target = 8,
}: {
  phraseIds: string[];
  records: VoicePracticeStore;
  target?: number;
}) {
  const total = phraseIds.length;
  const passed = phraseIds.filter((id) => {
    const r = records[id];
    return r && (r.result === "pass" || r.result === "manual");
  }).length;
  const practiced = phraseIds.filter((id) => !!records[id]).length;
  const met = passed >= target;
  const pct = total ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink">
          Luyện đọc: {practiced}/{total}
        </span>
        <span className={met ? "font-medium text-green-700" : "text-gray-400"}>
          Đạt yêu cầu: {passed}/{target}
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${met ? "bg-green-500" : "bg-brand-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {met
          ? "Bạn đã đạt mức luyện đọc khuyến nghị cho Day-One. 👍"
          : `Nên đạt ${target}/${total} câu để học bài tiếp theo hiệu quả hơn.`}
      </p>
      <p className="mt-1 text-[11px] text-gray-400">
        Nhận diện giọng nói chỉ hỗ trợ luyện tập, chưa phải chấm điểm phát âm chính thức.
      </p>
    </div>
  );
}
