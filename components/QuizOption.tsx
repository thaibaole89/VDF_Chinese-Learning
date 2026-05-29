"use client";

export default function QuizOption({
  text,
  pinyin,
  isChinese,
  showPinyin,
  state = "idle",
  disabled,
  onClick,
}: {
  text: string;
  pinyin?: string;
  isChinese?: boolean;
  showPinyin?: boolean;
  state?: "idle" | "correct" | "wrong";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const cls =
    state === "correct"
      ? "border-green-400 bg-green-50"
      : state === "wrong"
        ? "border-red-400 bg-red-50"
        : "border-gray-200 bg-white";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl border px-3 py-2.5 text-left tap ${cls}`}
    >
      <span className={isChinese ? "hanzi text-lg text-ink" : "text-base text-ink"}>{text}</span>
      {isChinese && showPinyin && pinyin ? (
        <span className="mt-0.5 block text-sm text-gray-500">{pinyin}</span>
      ) : null}
    </button>
  );
}
