"use client";

// Print / back actions for the certificate page. Phase 2B.9.
// `window.print()` triggers the browser's native print → Save as PDF dialog.
// These controls are hidden on print (print:hidden) so only the certificate
// itself appears on the page.

import Link from "next/link";

export default function CertificateActions() {
  return (
    <div className="flex flex-col gap-2 print:hidden">
      <button
        onClick={() => window.print()}
        className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white tap"
      >
        🖨️ In / Lưu PDF
      </button>
      <Link
        href="/account"
        className="w-full rounded-xl bg-white py-3 text-center text-sm font-medium text-brand-700 ring-1 ring-brand-100 tap"
      >
        ← Về Tài khoản
      </Link>
    </div>
  );
}
