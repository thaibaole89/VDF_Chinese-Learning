"use client";

import { useState } from "react";

// Collapsible Vietnamese note. Compliance notes are never hidden in the MVP —
// they are just collapsed when long so cards stay readable.
export default function NoteVi({ note, label = "Lưu ý" }: { note?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  if (!note || !note.trim()) return null;
  const long = note.length > 90;

  return (
    <p className="mt-2 text-xs leading-relaxed text-gray-500">
      <span className="font-medium text-gray-600">{label}: </span>
      {long && !open ? (
        <>
          {note.slice(0, 90)}…{" "}
          <button onClick={() => setOpen(true)} className="font-medium text-brand-600 underline">
            xem thêm
          </button>
        </>
      ) : (
        <>
          {note}
          {long && (
            <button onClick={() => setOpen(false)} className="ml-1 font-medium text-brand-600 underline">
              thu gọn
            </button>
          )}
        </>
      )}
    </p>
  );
}
