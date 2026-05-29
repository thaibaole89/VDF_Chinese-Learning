"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllFlashcardItems } from "@/lib/content";
import { getFlashcards, gradeFlashcard } from "@/lib/storage";
import type { FlashItem } from "@/lib/types";
import Flashcard from "@/components/Flashcard";

function orderByEase(items: FlashItem[]): FlashItem[] {
  const fc = getFlashcards();
  return [...items].sort((a, b) => {
    if (a.isDayOne !== b.isDayOne) return a.isDayOne ? -1 : 1;
    const ea = fc[a.id]?.ease ?? 2.5;
    const eb = fc[b.id]?.ease ?? 2.5;
    return ea - eb;
  });
}

export default function FlashcardsPage() {
  const [deck, setDeck] = useState<FlashItem[]>(() => getAllFlashcardItems());
  const [pos, setPos] = useState(0);
  const [reviewed, setReviewed] = useState(0);

  // Re-order by stored difficulty only after mount (keeps SSR/hydration stable).
  useEffect(() => setDeck(orderByEase(getAllFlashcardItems())), []);

  const cur = deck[pos];

  function grade(knew: boolean) {
    if (!cur) return;
    gradeFlashcard(cur.id, knew);
    setReviewed((r) => r + 1);
    if (!knew) {
      // re-queue a hard card so it shows again this session
      setDeck((prev) => {
        const next = [...prev];
        next.splice(Math.min(next.length, pos + 4), 0, cur);
        return next;
      });
    }
    setPos((p) => p + 1);
  }

  function restart() {
    setDeck(orderByEase(getAllFlashcardItems()));
    setPos(0);
  }

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <h1 className="text-xl font-bold text-ink">Thẻ ghi nhớ</h1>
          <span className="text-sm text-gray-400">Đã ôn: {reviewed}</span>
        </div>
        <p className="text-xs text-gray-400">Câu Day-One và từ “phải biết” hiện trước. Thẻ “Khó” lặp lại nhiều hơn.</p>
      </header>

      {deck.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm ring-1 ring-gray-100">
          Chưa có thẻ ghi nhớ.
        </div>
      ) : cur ? (
        <>
          <div className="text-center text-xs text-gray-400">
            Thẻ {Math.min(pos + 1, deck.length)} / {deck.length}
          </div>
          <Flashcard key={`${cur.id}-${pos}`} item={cur} onGrade={grade} />
        </>
      ) : (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
          <div className="text-3xl">🎉</div>
          <p className="mt-2 font-semibold text-ink">Đã ôn hết bộ thẻ!</p>
          <p className="mt-1 text-sm text-gray-500">Bạn đã xem {reviewed} thẻ.</p>
          <button onClick={restart} className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white tap">
            Ôn lại từ đầu
          </button>
        </div>
      )}
    </div>
  );
}
