// /certificate/day-one — printable Day-One completion certificate. Phase 2B.9.
//
// SECURITY: the route takes NO userId. Eligibility is computed for the CURRENT
// user only (computeDayOneEligibility → RLS-scoped to auth.uid()), so a learner
// can never view someone else's certificate by changing the URL. No email is
// shown. All eligibility checks are server-side; thresholds are reused from
// lib/dayOneEligibility (not duplicated).

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeDayOneEligibility } from "@/lib/dayOneEligibility";
import CertificateActions from "@/components/CertificateActions";

export const metadata = {
  title: "Chứng nhận Day-One · VDF Chinese",
  robots: { index: false, follow: false },
};

function formatDateVi(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  try {
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "—";
  }
}

function certId(userId: string): string {
  return "VDF-D1-" + userId.replace(/-/g, "").slice(0, 8).toUpperCase();
}

export default async function DayOneCertificatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <p className="text-sm text-gray-500">Bạn cần đăng nhập.</p>
      </div>
    );
  }

  const [{ data: profile }, eligibility] = await Promise.all([
    supabase.from("profiles").select("full_name, store").eq("id", user.id).maybeSingle(),
    computeDayOneEligibility(supabase),
  ]);

  // Name on the certificate — never the email (per spec). Falls back to a
  // neutral label if full_name isn't set in Supabase.
  const learnerName = (profile?.full_name ?? "").trim() || "Học viên VDF";
  const store = profile?.store ?? null;
  const r = eligibility.requirements;

  // ---------- NOT ELIGIBLE — requirement checklist ----------
  if (!eligibility.eligible) {
    const items = [
      {
        label: `Học đủ ${r.phrasesLearnedTarget} câu Day-One`,
        value: `${eligibility.phrasesLearned}/${r.phrasesLearnedTarget}`,
        met: eligibility.met.phrasesLearned,
      },
      {
        label: `Luyện đọc đạt ${r.voicePassedTarget}/${r.totalPhrases}`,
        value: `${eligibility.voicePassed}/${r.voicePassedTarget}`,
        met: eligibility.met.voicePassed,
      },
      {
        label: `Điểm quiz ≥ ${r.bestQuizScoreTarget}`,
        value: `${eligibility.bestQuizScore.toFixed(0)}/${r.bestQuizScoreTarget}`,
        met: eligibility.met.bestQuizScore,
      },
    ];
    return (
      <div className="space-y-5">
        <header className="pt-2">
          <Link href="/account" className="text-sm text-brand-600">
            ← Tài khoản
          </Link>
          <h1 className="mt-1 text-xl font-bold text-ink">Chứng nhận Day-One</h1>
          <p className="text-sm text-gray-500">Hoàn thành đủ điều kiện để nhận chứng nhận.</p>
        </header>
        <section className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100">
          <p className="text-sm font-semibold text-amber-900">Chưa đủ điều kiện</p>
          <ul className="mt-3 space-y-2">
            {items.map((it) => (
              <li key={it.label} className="flex items-center justify-between gap-2 rounded-xl bg-white/70 p-2.5">
                <span className="flex items-center gap-2 text-sm text-amber-900">
                  <span className={it.met ? "text-green-600" : "text-gray-300"} aria-hidden>
                    {it.met ? "✓" : "○"}
                  </span>
                  {it.label}
                </span>
                <span className={`nums text-sm font-semibold ${it.met ? "text-green-700" : "text-amber-700"}`}>
                  {it.value}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/day-one"
            className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white tap"
          >
            Tiếp tục học Day-One →
          </Link>
        </section>
      </div>
    );
  }

  // ---------- ELIGIBLE — printable certificate ----------
  const completionDate = formatDateVi(eligibility.earliestEligibleAt);
  const isCompletionDateKnown = !!eligibility.earliestEligibleAt;

  return (
    <div className="space-y-4">
      {/* The certificate — the only thing that prints. */}
      <article
        id="certificate"
        className="certificate mx-auto rounded-2xl border-2 border-brand-700 bg-white p-6 text-center shadow-card-lg ring-1 ring-brand-100 print:rounded-none print:border-2 print:shadow-none print:ring-0 sm:p-8"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/vdf-logo.png"
          alt="VDF — Vietnam Duty Free"
          width={1772}
          height={393}
          className="mx-auto h-9 w-auto"
        />
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">
          VDF Chinese Sales Tutor
        </p>
        <div className="mx-auto mt-3 h-px w-16 bg-gold-500" />

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">Chứng nhận hoàn thành</h1>
        <p className="mt-1 text-base font-semibold text-brand-700">Day-One Survival Chinese</p>
        <p className="hanzi mt-0.5 text-sm text-gray-500">上岗前必学十句</p>

        <p className="mt-6 text-xs uppercase tracking-wider text-gray-400">Trao tặng cho</p>
        <p className="mt-1 text-2xl font-bold text-ink">{learnerName}</p>
        {store && <p className="mt-0.5 text-sm text-gray-500">Cửa hàng: {store}</p>}

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-gray-700">
          Đã hoàn thành đầy đủ yêu cầu Day-One: thuộc 10 câu cốt lõi, luyện đọc đạt, và làm bài kiểm
          tra đạt mốc — sẵn sàng vào ca bán hàng tại quầy.
        </p>

        {/* Criteria summary */}
        <dl className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-2">
          <div className="rounded-xl bg-brand-50 p-2.5 ring-1 ring-brand-100">
            <dt className="text-[10px] uppercase tracking-wide text-brand-700">Câu đã thuộc</dt>
            <dd className="nums mt-0.5 text-base font-bold text-ink">
              {eligibility.phrasesLearned}/{eligibility.totalPhrases}
            </dd>
          </div>
          <div className="rounded-xl bg-brand-50 p-2.5 ring-1 ring-brand-100">
            <dt className="text-[10px] uppercase tracking-wide text-brand-700">Luyện đọc đạt</dt>
            <dd className="nums mt-0.5 text-base font-bold text-ink">
              {eligibility.voicePassed}/{eligibility.totalPhrases}
            </dd>
          </div>
          <div className="rounded-xl bg-brand-50 p-2.5 ring-1 ring-brand-100">
            <dt className="text-[10px] uppercase tracking-wide text-brand-700">Điểm quiz</dt>
            <dd className="nums mt-0.5 text-base font-bold text-ink">
              {eligibility.bestQuizScore.toFixed(0)}
            </dd>
          </div>
        </dl>

        <div className="mx-auto mt-6 flex max-w-md items-end justify-between gap-3 text-left">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400">
              {isCompletionDateKnown ? "Ngày hoàn thành" : "Ngày xác nhận (ngày in)"}
            </p>
            <p className="nums text-sm font-semibold text-ink">{completionDate}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">Mã chứng nhận</p>
            <p className="nums text-sm font-semibold text-ink">{certId(user.id)}</p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-md text-[11px] italic leading-relaxed text-gray-400">
          Chứng nhận hoàn thành đào tạo nội bộ, không phải chứng chỉ ngôn ngữ chính thức.
        </p>
      </article>

      <div className="mx-auto max-w-md">
        <CertificateActions />
      </div>
    </div>
  );
}
