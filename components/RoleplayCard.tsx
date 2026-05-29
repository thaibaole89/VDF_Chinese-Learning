"use client";

import { useState } from "react";
import type { RoleplayScenario, Dialogue } from "@/lib/types";
import SpeakButton from "./SpeakButton";
import StatusBadge from "./StatusBadge";

export default function RoleplayCard({
  roleplay,
  sampleDialogue,
}: {
  roleplay: RoleplayScenario;
  sampleDialogue?: Dialogue;
}) {
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ink">{roleplay.titleVi}</h3>
        <StatusBadge status={roleplay.status} />
      </div>
      <p className="mt-1 text-sm text-gray-500">{roleplay.scenarioVi}</p>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div className="rounded-lg bg-gray-50 p-2">
          <span className="font-medium text-gray-600">🧍 Khách muốn: </span>
          {roleplay.customerGoalVi}
        </div>
        <div className="rounded-lg bg-brand-50 p-2">
          <span className="font-medium text-brand-700">🧑‍💼 Nhân viên cần: </span>
          {roleplay.staffGoalVi}
        </div>
      </div>

      {roleplay.requiredPhrases?.length ? (
        <div className="mt-3">
          <div className="mb-1 text-xs font-semibold text-gray-500">Câu bắt buộc dùng:</div>
          <ul className="space-y-1">
            {roleplay.requiredPhrases.map((p, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-2">
                <span className="hanzi text-base text-ink">{p}</span>
                <SpeakButton text={p} label="" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {sampleDialogue && (
        <div className="mt-3">
          <button
            onClick={() => setShowSample((v) => !v)}
            className="text-sm font-medium text-brand-600 underline"
          >
            {showSample ? "Ẩn hội thoại mẫu" : "Xem hội thoại mẫu"}
          </button>
          {showSample && (
            <ul className="mt-2 space-y-1.5">
              {sampleDialogue.lines.map((ln, i) => (
                <li key={i} className="text-sm">
                  <span
                    className={ln.speaker === "staff" ? "font-medium text-brand-700" : "text-gray-500"}
                  >
                    {ln.speaker === "staff" ? "NV" : "Khách"}:{" "}
                  </span>
                  <span className="hanzi">{ln.zh}</span>{" "}
                  <span className="text-gray-400">{ln.pinyin}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
