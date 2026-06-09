"use client";

// Korean course home — modules → lessons. Phase 2D: hydrates from server-side
// progress when available (migration 005/006), else falls back to the local
// mirror (and flags it) and offers a one-time sync of leftover local progress.
// Korean is NOT in the Hall of Fame and has no certificate. Reuses illustrations.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KOREAN_COURSE, allKoreanPhraseIds, type KoLesson } from "@/lib/koreanCourse";
import { getKoLearned, getKoVoicePassed } from "@/lib/koreanProgress";
import { syncLocalKoreanProgress } from "@/lib/koreanActions";
import { koreanCourseHeroVisual, koreanLessonVisual } from "@/lib/koreanVisuals";
import Visual from "@/components/Visual";

function lessonStatus(
  lesson: KoLesson,
  learned: Set<string>,
  completedLessons: Set<string>
): { label: string; cls: string; cta: string } {
  if (lesson.status === "coming" || lesson.phrases.length === 0) {
    return { label: "Sắp ra mắt", cls: "bg-gray-100 text-gray-500", cta: "Xem trước" };
  }
  const done = lesson.phrases.filter((p) => learned.has(p.id)).length;
  if (completedLessons.has(lesson.id) || (done >= lesson.phrases.length && lesson.phrases.length > 0)) {
    return { label: "Hoàn thành", cls: "bg-green-100 text-green-800", cta: "Ôn lại" };
  }
  if (done === 0) return { label: "Chưa bắt đầu", cls: "bg-gray-100 text-gray-600", cta: "Bắt đầu" };
  return { label: `Đang học · ${done}/${lesson.phrases.length}`, cls: "bg-amber-100 text-amber-800", cta: "Tiếp tục học" };
}

export default function KoreanLessonList({
  serverOk = false,
  learnedPhraseIds = [],
  voicePassedPhraseIds = [],
  completedLessonIds = [],
}: {
  serverOk?: boolean;
  learnedPhraseIds?: string[];
  voicePassedPhraseIds?: string[];
  completedLessonIds?: string[];
}) {
  const router = useRouter();
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [localOnly, setLocalOnly] = useState(!serverOk);
  const [localLeftover, setLocalLeftover] = useState<{ learned: string[]; voice: string[] }>({ learned: [], voice: [] });
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  useEffect(() => {
    const localLearned = getKoLearned();
    const localVoice = getKoVoicePassed();
    if (serverOk) {
      setLearned(new Set(learnedPhraseIds));
      setCompleted(new Set(completedLessonIds));
      const serverLearnedSet = new Set(learnedPhraseIds);
      const serverVoiceSet = new Set(voicePassedPhraseIds);
      setLocalLeftover({
        learned: localLearned.filter((id) => !serverLearnedSet.has(id)),
        voice: localVoice.filter((id) => !serverVoiceSet.has(id)),
      });
    } else {
      const ls = new Set(localLearned);
      setLearned(ls);
      const comp = new Set<string>();
      for (const m of KOREAN_COURSE.modules) {
        for (const l of m.lessons) {
          if (l.phrases.length > 0 && l.phrases.every((p) => ls.has(p.id))) comp.add(l.id);
        }
      }
      setCompleted(comp);
      setLocalOnly(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const all = allKoreanPhraseIds();
    const done = all.filter((id) => learned.has(id)).length;
    return { all: all.length, done, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  }, [learned]);

  const hasLeftover = serverOk && (localLeftover.learned.length > 0 || localLeftover.voice.length > 0);

  async function doSync() {
    setSyncing(true);
    setSyncMsg(null);
    const res = await syncLocalKoreanProgress({ learned: localLeftover.learned, voicePassed: localLeftover.voice });
    setSyncing(false);
    if (res.ok) {
      setSyncMsg(`Đã đồng bộ ${res.learnedSynced ?? 0} câu lên máy chủ.`);
      setLocalLeftover({ learned: [], voice: [] });
      router.refresh();
    } else {
      setSyncMsg("Không đồng bộ được. Sẽ thử lại sau.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl shadow-card-lg">
        <Visual asset={koreanCourseHeroVisual()} variant="header" priority />
        <header className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
          <div className="text-xs font-medium uppercase tracking-wide text-brand-100">Khoá học · 한국어</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{KOREAN_COURSE.titleVi}</h1>
          <p className="mt-1 text-sm text-brand-100">{KOREAN_COURSE.descriptionVi}</p>
        </header>
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link href="/courses" className="font-medium text-brand-700">
          ← Chọn khoá khác
        </Link>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">🇰🇷 한국어 · ko-KR</span>
      </div>

      <p className="rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-800 ring-1 ring-amber-100">
        ⚠️ Tiếng Hàn đang chờ duyệt nội bộ về ngôn ngữ.
      </p>

      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">Tiến độ tiếng Hàn</span>
          <span className="nums text-sm font-bold text-brand-700">{totals.pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${totals.pct}%` }} />
        </div>
        <p className="mt-2 nums text-xs text-gray-500">Đã thuộc {totals.done}/{totals.all} câu</p>
        {localOnly && (
          <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800 ring-1 ring-amber-100">
            ⚠️ Tiến độ đang lưu trên thiết bị này (chưa đồng bộ máy chủ).
          </p>
        )}
      </section>

      {hasLeftover && (
        <section className="rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100">
          <p className="text-xs text-brand-800">
            Phát hiện tiến độ tiếng Hàn cũ trên thiết bị này ({localLeftover.learned.length} câu) chưa có trên máy chủ.
          </p>
          <button
            onClick={doSync}
            disabled={syncing}
            className="mt-2 w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white tap disabled:opacity-60"
          >
            {syncing ? "Đang đồng bộ…" : "Đồng bộ tiến độ cũ lên máy chủ"}
          </button>
          {syncMsg && <p className="mt-2 text-xs text-brand-800">{syncMsg}</p>}
        </section>
      )}
      {!hasLeftover && syncMsg && (
        <p className="rounded-lg bg-green-50 p-2 text-xs text-green-800 ring-1 ring-green-100">{syncMsg}</p>
      )}

      {KOREAN_COURSE.modules.map((m) => (
        <section key={m.id} className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-ink">{m.titleVi}</h2>
            <p className="hanzi text-xs text-gray-500">
              {m.titleKo} — {m.objectiveVi}
            </p>
          </div>
          <div className="space-y-2">
            {m.lessons.map((lesson) => {
              const st = lessonStatus(lesson, learned, completed);
              return (
                <Link key={lesson.id} href={`/courses/korean/lessons/${lesson.id}`} className="block rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card">
                  <div className="flex items-start gap-3">
                    <Visual asset={koreanLessonVisual(lesson.id)} variant="thumb" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-ink">{lesson.titleVi}</div>
                      <div className="hanzi text-xs text-gray-500">{lesson.titleKo}</div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${st.cls}`}>{st.label}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{lesson.objectiveVi}</span>
                    <span className="shrink-0 text-sm font-medium text-brand-700">{st.cta} →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">
        Nội dung tiếng Hàn đang chờ duyệt nội bộ về ngôn ngữ. Tiến độ tiếng Hàn được lưu trên máy chủ và đồng bộ giữa các
        thiết bị khi bạn đăng nhập (không tính vào chứng nhận hay Bảng vinh danh).
      </p>
    </div>
  );
}
