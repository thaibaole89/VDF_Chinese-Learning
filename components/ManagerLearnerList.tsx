"use client";

// Manager learner list with client-side filters/search. Phase 2B.7.
// Data is precomputed server-side (lib/managerDashboard) and passed in — this
// component only filters and renders. No emails shown here (list view).

import Link from "next/link";
import { useMemo, useState } from "react";
import { STATUS_LABEL, type LearnerStatus, type ManagerLearnerRow } from "@/lib/managerDashboard";

const STATUS_PILL: Record<LearnerStatus, string> = {
  certified: "bg-green-100 text-green-800",
  needs_quiz: "bg-amber-100 text-amber-800",
  needs_voice: "bg-orange-100 text-orange-800",
  not_certified: "bg-gray-100 text-gray-700",
  not_started: "bg-gray-100 text-gray-500",
};

function StatusPill({ status }: { status: LearnerStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_PILL[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "—";
  }
}

type CertFilter = "all" | "certified" | "not_certified";

export default function ManagerLearnerList({
  learners,
  stores,
}: {
  learners: ManagerLearnerRow[];
  stores: string[];
}) {
  const [store, setStore] = useState<string>("all");
  const [cert, setCert] = useState<CertFilter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return learners.filter((l) => {
      if (store !== "all" && (l.store ?? "") !== store) return false;
      if (cert === "certified" && !l.certified) return false;
      if (cert === "not_certified" && l.certified) return false;
      if (needle && !l.displayName.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [learners, store, cert, q]);

  return (
    <section className="space-y-3">
      {/* Filters */}
      <div className="rounded-2xl bg-white p-3 shadow-card ring-1 ring-gray-100">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên…"
          className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            aria-label="Lọc theo cửa hàng"
          >
            <option value="all">Tất cả cửa hàng</option>
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={cert}
            onChange={(e) => setCert(e.target.value as CertFilter)}
            className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            aria-label="Lọc theo chứng nhận"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="certified">Đã đạt chứng nhận</option>
            <option value="not_certified">Chưa đạt</option>
          </select>
        </div>
        <p className="mt-2 text-[11px] text-gray-400">
          Hiển thị {filtered.length}/{learners.length} học viên · chỉ tên &amp; cửa hàng (không hiện email).
        </p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-5 text-center text-sm text-gray-500 shadow-card ring-1 ring-gray-100">
          Không có học viên khớp bộ lọc.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((l) => (
            <li key={l.userId}>
              <Link
                href={`/manager/learners/${l.userId}`}
                className="block rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-ink">{l.displayName}</div>
                    <div className="text-[11px] text-gray-500">{l.store ?? "—"}</div>
                  </div>
                  <StatusPill status={l.status} />
                </div>
                <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
                  <Stat label="Quiz" value={`${l.bestQuizScore.toFixed(0)}`} />
                  <Stat label="Đọc đạt" value={`${l.voicePassCount}`} />
                  <Stat label="Đã thuộc" value={`${l.phraseLearnedCount}`} />
                  <Stat label="Bắt buộc" value={`${l.requiredCompleted}/${l.requiredTotal}`} />
                </dl>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Hoạt động gần nhất: {formatDate(l.lastActivity)}</span>
                  <span className="text-brand-600">Chi tiết →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-1 py-1.5">
      <div className="nums text-sm font-bold text-ink">{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  );
}
