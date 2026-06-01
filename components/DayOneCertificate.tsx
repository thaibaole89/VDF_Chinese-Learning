// Day-One certificate card. RENDERED ONLY WHEN SERVER-VALIDATED ELIGIBLE.
// Caller (/account/page.tsx) computes eligibility via lib/dayOneEligibility.ts
// (server-side, RLS-scoped). This component is intentionally dumb — given
// `eligible=true`, just renders the certificate. It never reads from
// localStorage and never re-checks eligibility.
//
// Phase 2A.4: no PDF export, no share, no print. Just visual recognition.

type Props = {
  displayName: string;
  store?: string | null;
  /** UTC ISO timestamp; if null, falls back to "(không xác định)". */
  earliestEligibleAt: string | null;
  /** Numbers used for the small "đạt: x/10 · y/10 · z/100" line. */
  phrasesLearned: number;
  voicePassed: number;
  bestQuizScore: number;
  totalPhrases: number;
};

function formatVi(iso: string | null): string {
  if (!iso) return "(không xác định)";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "(không xác định)";
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "(không xác định)";
  }
}

export default function DayOneCertificate({
  displayName,
  store,
  earliestEligibleAt,
  phrasesLearned,
  voicePassed,
  bestQuizScore,
  totalPhrases,
}: Props) {
  return (
    <section
      aria-label="Chứng nhận Day-One"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 text-white shadow-lg ring-1 ring-brand-500"
    >
      {/* Decorative corner badges */}
      <span
        aria-hidden
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl"
      />
      <span
        aria-hidden
        className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-300 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-900">
            🏅 Chứng nhận
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
            Day-One Survival
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-bold leading-tight">
          上岗前必学十句
        </h2>
        <p className="mt-1 text-base font-medium text-white/90">
          10 câu sống còn tại quầy
        </p>

        <div className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wider text-white/70">
            Trao tặng cho
          </p>
          <p className="mt-1 text-xl font-bold">{displayName}</p>
          {store ? (
            <p className="mt-0.5 text-sm text-white/80">Cửa hàng: {store}</p>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/90">
          Đã hoàn thành đầy đủ yêu cầu Day-One: thuộc 10 câu cốt lõi, luyện
          đọc đạt, và làm kiểm tra nhanh đạt mốc. Sẵn sàng vào ca bán hàng
          đầu tiên tại quầy.
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/10 p-2 ring-1 ring-white/20">
            <dt className="text-[10px] uppercase tracking-wider text-white/70">
              Đã thuộc
            </dt>
            <dd className="mt-0.5 text-base font-bold">
              {phrasesLearned}/{totalPhrases}
            </dd>
          </div>
          <div className="rounded-xl bg-white/10 p-2 ring-1 ring-white/20">
            <dt className="text-[10px] uppercase tracking-wider text-white/70">
              Luyện đọc
            </dt>
            <dd className="mt-0.5 text-base font-bold">
              {voicePassed}/{totalPhrases}
            </dd>
          </div>
          <div className="rounded-xl bg-white/10 p-2 ring-1 ring-white/20">
            <dt className="text-[10px] uppercase tracking-wider text-white/70">
              Quiz
            </dt>
            <dd className="mt-0.5 text-base font-bold">
              {Number(bestQuizScore).toFixed(0)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between text-xs text-white/70">
          <span>Hoàn thành lúc: {formatVi(earliestEligibleAt)}</span>
          <span className="font-semibold text-white/90">VDF Chinese</span>
        </div>

        <p className="mt-3 text-[11px] italic text-white/60">
          Chứng nhận nội bộ — phục vụ chương trình pilot Vietnam Duty Free.
          Bản PDF/in sẽ được bổ sung ở Phase sau.
        </p>
      </div>
    </section>
  );
}
