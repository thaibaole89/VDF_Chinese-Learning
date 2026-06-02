// Podium + ranked list for the weekly Hall of Fame. Phase 2B.3.
// Presentational, server-renderable. Highlights the current user's row.

import type { LeaderboardEntry } from "@/lib/leaderboard";

const PODIUM_STYLE = [
  { ring: "ring-amber-300", bg: "bg-amber-50", medal: "🥇", badge: "bg-amber-400 text-amber-900" },
  { ring: "ring-gray-300", bg: "bg-gray-50", medal: "🥈", badge: "bg-gray-300 text-gray-800" },
  { ring: "ring-orange-300", bg: "bg-orange-50", medal: "🥉", badge: "bg-orange-300 text-orange-900" },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function PodiumCard({
  entry,
  place,
  isMe,
}: {
  entry: LeaderboardEntry;
  place: 0 | 1 | 2;
  isMe: boolean;
}) {
  const s = PODIUM_STYLE[place];
  return (
    <div
      className={`flex flex-col items-center rounded-2xl p-3 text-center ring-1 ${s.ring} ${s.bg} ${
        isMe ? "ring-2 ring-brand-500" : ""
      }`}
    >
      <div className="text-2xl" aria-hidden>
        {s.medal}
      </div>
      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-ink ring-1 ring-gray-200">
        {initials(entry.displayName)}
      </div>
      <div className="mt-1.5 line-clamp-2 text-xs font-semibold text-ink">{entry.displayName}</div>
      {entry.store && <div className="text-[10px] text-gray-500">{entry.store}</div>}
      <div className="mt-1 text-base font-bold tabular-nums text-ink">{entry.weeklyScore}đ</div>
      {entry.dayOneCertified && (
        <div className="mt-0.5 text-[10px] font-medium text-green-700">🏅 Day-One</div>
      )}
      {isMe && (
        <div className="mt-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-white">
          Bạn
        </div>
      )}
    </div>
  );
}

function ListRow({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${
        isMe ? "bg-brand-50 ring-brand-200" : "bg-white ring-gray-100"
      }`}
    >
      <div className="w-7 shrink-0 text-center text-sm font-bold tabular-nums text-gray-500">
        {entry.rank}
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
        {initials(entry.displayName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-ink">{entry.displayName}</span>
          {isMe && (
            <span className="shrink-0 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
              Bạn
            </span>
          )}
          {entry.dayOneCertified && (
            <span className="shrink-0 text-[11px]" title="Đã có chứng nhận Day-One" aria-hidden>
              🏅
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-2 text-[11px] text-gray-500">
          {entry.store && <span>{entry.store}</span>}
          <span>{entry.completedRequiredCount} bài bắt buộc</span>
          <span>{entry.voicePassCount} câu đọc đạt</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold tabular-nums text-ink">{entry.weeklyScore}đ</div>
      </div>
    </li>
  );
}

export default function LeaderboardView({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[];
  currentUserId: string;
}) {
  const hasActivity = entries.some((e) => e.weeklyScore > 0);
  if (entries.length === 0 || !hasActivity) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
        <div className="text-3xl" aria-hidden>
          🏆
        </div>
        <h2 className="mt-2 text-base font-bold text-ink">Chưa có hoạt động tuần này</h2>
        <p className="mt-1 text-sm text-gray-500">
          Hãy là người đầu tiên ghi điểm: học một bài, luyện đọc, hoặc làm bài kiểm tra Day-One.
        </p>
      </div>
    );
  }

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-4">
      {/* Podium */}
      <div className="grid grid-cols-3 gap-2">
        {podium.map((e, i) => (
          <PodiumCard key={e.userId} entry={e} place={i as 0 | 1 | 2} isMe={e.userId === currentUserId} />
        ))}
      </div>

      {/* Ranked list (4th onward) */}
      {rest.length > 0 && (
        <ul className="space-y-2">
          {rest.map((e) => (
            <ListRow key={e.userId} entry={e} isMe={e.userId === currentUserId} />
          ))}
        </ul>
      )}
    </div>
  );
}
