"use client";

import { useState } from "react";
import type { RoleplayScenario, Dialogue } from "@/lib/types";
import { getPinyinFor } from "@/lib/content";
import ChineseLine from "./ChineseLine";
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
          <ul className="space-y-2">
            {roleplay.requiredPhrases.map((p, i) => (
              <li key={i} className="rounded-lg bg-gray-50 p-2">
                <ChineseLine zh={p} pinyin={getPinyinFor(p)} size="sm" />
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
            <ul className="mt-2 space-y-2">
              {sampleDialogue.lines.map((ln, i) => (
                <li key={i} className={`rounded-lg p-2 ${ln.speaker === "staff" ? "bg-brand-50" : "bg-gray-50"}`}>
                  <div className="mb-0.5 text-[11px] font-semibold uppercase text-gray-400">
                    {ln.speaker === "staff" ? "NV" : "Khách"}
                  </div>
                  <ChineseLine zh={ln.zh} pinyin={ln.pinyin} vi={ln.vi} size="sm" showSpeak={false} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
