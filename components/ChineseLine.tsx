"use client";

import type { ContentStatus, RiskLevel } from "@/lib/types";
import { usePinyinPref } from "@/lib/usePinyin";
import SpeakButton from "./SpeakButton";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import NoteVi from "./NoteVi";

const ZH_SIZE: Record<string, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

// Shared Chinese-line renderer: hanzi + (optional) pinyin + (optional) Vietnamese
// + optional Speak button and review/risk badges. Pinyin visibility follows the
// global preference unless `showPinyin` is passed explicitly (overrides).
export default function ChineseLine({
  zh,
  pinyin,
  vi,
  showPinyin,
  size = "md",
  showSpeak = true,
  audioText,
  status,
  riskLevel,
  noteVi,
}: {
  zh: string;
  pinyin?: string;
  vi?: string;
  showPinyin?: boolean;
  size?: "sm" | "md" | "lg";
  showSpeak?: boolean;
  audioText?: string;
  status?: ContentStatus;
  riskLevel?: RiskLevel;
  noteVi?: string;
}) {
  const pref = usePinyinPref(true);
  const show = showPinyin ?? pref;
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className={`hanzi font-semibold leading-snug text-ink ${ZH_SIZE[size] ?? ZH_SIZE.md}`}>{zh}</div>
        {show && pinyin ? <div className="mt-0.5 text-sm text-gray-500">{pinyin}</div> : null}
        {vi ? <div className="mt-0.5 text-base text-ink">{vi}</div> : null}
        {status || riskLevel ? (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <RiskBadge riskLevel={riskLevel} />
          </div>
        ) : null}
        <NoteVi note={noteVi} />
      </div>
      {showSpeak ? <SpeakButton text={audioText ?? zh} label="" /> : null}
    </div>
  );
}
