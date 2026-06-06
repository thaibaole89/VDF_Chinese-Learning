import type { ReviewStats } from "@/lib/types";

function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-card ring-1 ring-gray-100">
      <div className="nums text-2xl font-semibold tracking-tight text-ink">{value}</div>
      <div className="mt-0.5 text-xs text-gray-500">{label}</div>
      {sub && <div className="nums text-[11px] text-gray-400">{sub}</div>}
    </div>
  );
}

export default function ProgressSummary({ stats }: { stats: ReviewStats }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Tile label="Câu sống còn" value={`${stats.dayOneCompleted}/${stats.dayOneTotal}`} />
      <Tile label="Bài đã xong" value={`${stats.lessonsCompleted}/${stats.lessonsTotal}`} />
      <Tile label="Chuỗi ngày" value={stats.streak > 0 ? `${stats.streak}🔥` : "0"} />
      <Tile label="Thẻ đã ôn" value={stats.cardsReviewed} />
      <Tile label="Độ chính xác" value={`${stats.quizAccuracy}%`} sub={`${stats.quizCorrect}/${stats.quizTotal} quiz`} />
      <Tile label="Từ khó" value={stats.hardWords} />
    </div>
  );
}
