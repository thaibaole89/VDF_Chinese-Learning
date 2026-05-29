"use client";

import { useState } from "react";
import type { Dialogue } from "@/lib/types";
import SpeakButton from "./SpeakButton";

export default function DialoguePractice({ dialogue }: { dialogue: Dialogue }) {
  const [staffOnly, setStaffOnly] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-ink">{dialogue.titleVi}</h3>
        <button
          onClick={() => setStaffOnly((v) => !v)}
          className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 tap"
        >
          {staffOnly ? "Hiện cả khách" : "Luyện câu nhân viên"}
        </button>
      </div>
      <p className="mt-1 text-sm text-gray-500">{dialogue.scenarioVi}</p>
      <ul className="mt-3 space-y-2">
        {dialogue.lines.map((ln, i) => {
          const isStaff = ln.speaker === "staff";
          if (staffOnly && !isStaff) return null;
          return (
            <li
              key={i}
              className={`rounded-xl p-3 ${isStaff ? "bg-brand-50 ring-1 ring-brand-100" : "bg-gray-50"}`}
            >
              <div
                className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                  isStaff ? "text-brand-600" : "text-gray-400"
                }`}
              >
                {isStaff ? "Nhân viên" : "Khách"}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="hanzi text-xl text-ink">{ln.zh}</div>
                  <div className="text-sm text-gray-500">{ln.pinyin}</div>
                  <div className="text-sm text-ink">{ln.vi}</div>
                </div>
                <SpeakButton text={ln.zh} label="" />
              </div>
              {ln.noteVi && <p className="mt-1 text-xs text-orange-700">Lưu ý: {ln.noteVi}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
