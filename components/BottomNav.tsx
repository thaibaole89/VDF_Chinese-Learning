"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Trang chủ", icon: "🏠" },
  { href: "/lessons", label: "Bài học", icon: "📚" },
  { href: "/flashcards", label: "Thẻ", icon: "🃏" },
  { href: "/search", label: "Tìm", icon: "🔍" },
  // Phase 2B.1 — bottom-nav slot now points at the learner dashboard
  // (/account). /progress is kept as a redirect for old bookmarks.
  { href: "/account", label: "Tài khoản", icon: "👤" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur safe-bottom">
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-between">
        {ITEMS.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] tap ${
                  active ? "font-semibold text-brand-700" : "text-gray-500"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {it.icon}
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
