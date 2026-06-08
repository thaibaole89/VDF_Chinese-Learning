"use client";

// /day-one/phrases — Day-One 10-phrase learning + voice practice.
// Phase 2A.6 extraction from the old monolithic /day-one page. Preserves the
// existing togglePhraseLearned + submitVoiceAttempt facade calls so cert
// eligibility and server progress mirror behavior are unchanged.

import { useEffect, useState } from "react";
import { getDayOneLesson } from "@/lib/content";
import { getProgress, getVoicePracticeRecords } from "@/lib/storage";
import { togglePhraseLearned } from "@/lib/progress";
import PhraseCard from "@/components/PhraseCard";
import PinyinToggle from "@/components/PinyinToggle";
import SpeechToggle from "@/components/SpeechToggle";
import VoicePracticePanel from "@/components/VoicePracticePanel";
import VoiceGateSummary from "@/components/VoiceGateSummary";
import PhraseBreakdownPanel from "@/components/PhraseBreakdownPanel";
import GrammarTips from "@/components/GrammarTips";
import { CHINESE_GRAMMAR } from "@/lib/chineseGrammar";
import { DayOneSectionHeader, DayOneSectionFooter } from "@/components/DayOneSectionNav";
import type { VoicePracticeStore } from "@/lib/types";

export default function DayOnePhrasesPage() {
  const lesson = getDayOneLesson();
  const [done, setDone] = useState<string[]>([]);
  const [voiceRecords, setVoiceRecords] = useState<VoicePracticeStore>({});

  useEffect(() => {
    setDone(getProgress().completedPhraseIds);
    setVoiceRecords(getVoicePracticeRecords());
  }, []);

  const refreshVoice = () => setVoiceRecords(getVoicePracticeRecords());

  if (!lesson) {
    return <p className="text-sm text-gray-500">Không tìm thấy nội dung Day-One.</p>;
  }

  const phrases = lesson.sentencePatterns ?? [];
  const completedCount = phrases.filter((p) => done.includes(p.id)).length;
  const pct = phrases.length ? Math.round((completedCount / phrases.length) * 100) : 0;
  const allLearned = phrases.length > 0 && completedCount === phrases.length;

  function toggle(id: string) {
    setDone(togglePhraseLearned(id).completedPhraseIds);
  }

  return (
    <div className="space-y-5">
      <DayOneSectionHeader
        section="phrases"
        badge={
          allLearned
            ? { label: "✓ Đã thuộc đủ 10", tone: "success" }
            : completedCount > 0
              ? { label: `${completedCount}/${phrases.length}`, tone: "neutral" }
              : undefined
        }
      />

      {/* Sticky progress bar — phrases-only */}
      <div className="sticky top-0 z-10 -mx-4 bg-slate-50/95 px-4 py-2 backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">
            Đã thuộc {completedCount}/{phrases.length}
          </span>
          <span className="text-gray-400">{pct}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-500">Luyện đọc bằng giọng nói</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/check" className="text-xs text-brand-600 underline">
            Kiểm tra micro & loa →
          </a>
          <SpeechToggle />
          <PinyinToggle />
        </div>
      </div>
      <VoiceGateSummary phraseIds={phrases.map((p) => p.id)} records={voiceRecords} target={8} />

      <section className="space-y-3">
        {phrases.map((p, i) => (
          <div key={p.id} className="space-y-2">
            <PhraseCard
              index={i + 1}
              zh={p.zh}
              pinyin={p.pinyin}
              vi={p.vi}
              usageVi={p.usageVi}
              note={p.noteVi}
              audioText={p.audioText}
              status={p.status}
              riskLevel={p.riskLevel}
              done={done.includes(p.id)}
              onToggleDone={() => toggle(p.id)}
            />
            <PhraseBreakdownPanel phraseId={p.id} />
            <VoicePracticePanel
              phrase={{ id: p.id, zh: p.zh, pinyin: p.pinyin, vi: p.vi, audioText: p.audioText, lessonId: lesson.id }}
              onSaved={refreshVoice}
            />
          </div>
        ))}
      </section>

      <GrammarTips tips={CHINESE_GRAMMAR["lesson_day_one_10_phrases"]} cjk />

      <DayOneSectionFooter section="phrases" />
    </div>
  );
}
