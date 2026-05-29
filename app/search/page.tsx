"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import SpeakButton from "@/components/SpeakButton";
import StatusBadge from "@/components/StatusBadge";
import { searchContent } from "@/lib/content";
import type { SearchResultType } from "@/lib/types";

const TYPE_LABEL: Record<SearchResultType, string> = {
  vocabulary: "Từ vựng",
  phrase: "Mẫu câu",
  brand: "Thương hiệu",
  measure_word: "Lượng từ",
  dialogue: "Hội thoại",
};

const EXAMPLES = ["hộ chiếu", "thanh toán", "Alipay", "nước hoa", "hết hàng", "giảm giá", "Lancôme", "Marlboro", "免税"];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const trimmed = q.trim();
  const results = trimmed ? searchContent(q) : [];

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Tìm câu / từ</h1>
      </header>

      <SearchBox value={q} onChange={setQ} />

      {!trimmed && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQ(ex)}
              className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm ring-1 ring-gray-100 tap"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {trimmed && <div className="text-xs text-gray-400">{results.length} kết quả</div>}

      <ul className="space-y-2">
        {results.map((r) => (
          <li key={`${r.type}-${r.id}`} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                    {TYPE_LABEL[r.type]}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
                <div className="mt-1 hanzi text-xl text-ink">{r.zh}</div>
                <div className="text-sm text-gray-500">{r.pinyin}</div>
                <div className="text-sm text-ink">
                  {r.vi}
                  {r.extra ? <span className="text-gray-400"> · {r.extra}</span> : null}
                </div>
                {r.lessonId && (
                  <Link href={`/lessons/${r.lessonId}`} className="mt-1 inline-block text-xs text-brand-600">
                    Xem bài học →
                  </Link>
                )}
              </div>
              <SpeakButton text={r.audioText ?? r.zh} label="" />
            </div>
          </li>
        ))}
      </ul>

      {trimmed && results.length === 0 && (
        <p className="text-sm text-gray-400">Không tìm thấy. Thử từ khóa khác.</p>
      )}
    </div>
  );
}
