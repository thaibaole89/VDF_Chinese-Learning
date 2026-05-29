"use client";

export default function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Tìm: hộ chiếu, thanh toán, Alipay, 免税…"}
        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
