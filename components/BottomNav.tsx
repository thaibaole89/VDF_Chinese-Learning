"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Trang chủ", icon: "🏠" },
  { href: "/lessons", label: "Bài học", icon: "📚" },
  // Phase 2B.4.2 — promote the live translation tool to a primary nav slot.
  { href: "/tools/translate", label: "Dịch", icon: "🗣️" },
  { href: "/flashcards", label: "Thẻ", icon: "🃏" },
  { href: "/search", label: "Tìm", icon: "🔍" },
  // Phase 2B.1 — bottom-nav slot now points at the learner dashboard
  // (/account). /progress is kept as a redirect for old bookmarks.
  { href: "/account", label: "Tài khoản", icon: "👤" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/90 shadow-card-lg backdrop-blur safe-bottom">
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-between">
        {ITEMS.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 px-0.5 py-2 text-[11px] tap ${
                  active
                    ? "font-semibold text-brand-700"
                    : "text-gray-500 hover:text-brand-600"
                }`}
              >
                {/* Active indicator bar at the top of the tab. */}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 top-0 h-0.5 rounded-full bg-brand-600 transition-opacity duration-200 ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span className={`text-lg transition-transform duration-200 ${active ? "-translate-y-px" : ""}`} aria-hidden>
                  {it.icon}
                </span>
                <span className="whitespace-nowrap leading-tight">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
