import Link from "next/link";
import { getBrandsByCategory, getMeasureWordsByCategory } from "@/lib/content";
import type { BrandReference, MeasureWord } from "@/lib/types";
import SpeakButton from "@/components/SpeakButton";
import NoteVi from "@/components/NoteVi";

const MW_CATEGORY_VI: Record<string, string> = {
  beauty: "Mỹ phẩm",
  liquor_tobacco_sweets: "Rượu / thuốc lá / bánh kẹo",
  fashion: "Thời trang",
  general: "Chung",
};

function BrandRow({ b }: { b: BrandReference }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <div className="min-w-0">
        <div className="font-semibold text-ink">{b.latinName}</div>
        <div className="hanzi text-xl text-ink">{b.hanzi}</div>
        <div className="text-sm text-gray-500">
          {b.pinyin}
          {b.origin ? <span className="text-gray-400"> · {b.origin}</span> : null}
        </div>
        <NoteVi note={b.noteVi} />
      </div>
      <SpeakButton text={b.audioText ?? b.hanzi} label="" />
    </div>
  );
}

function MeasureRow({ w }: { w: MeasureWord }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <div className="min-w-0">
        <div className="hanzi text-2xl font-semibold text-ink">{w.hanzi}</div>
        <div className="text-sm text-gray-500">{w.pinyin}</div>
        <div className="text-sm text-ink">{w.usesForVi}</div>
        {w.examples?.length ? (
          <ul className="mt-1 space-y-0.5">
            {w.examples.map((ex, i) => (
              <li key={i} className="text-xs text-gray-500">
                <span className="hanzi">{ex.zh}</span> {ex.pinyin}
                {ex.vi ? ` — ${ex.vi}` : ""}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <SpeakButton text={w.hanzi} label="" />
    </div>
  );
}

export default function ReferencesPage() {
  const { beauty, liquorTobacco } = getBrandsByCategory();
  const measureByCat = getMeasureWordsByCategory();

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Tra cứu</h1>
        <p className="text-sm text-gray-500">Phát âm thương hiệu & lượng từ theo ngành hàng.</p>
      </header>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Thương hiệu mỹ phẩm ({beauty.length})
        </h2>
        <div className="space-y-2">
          {beauty.map((b) => (
            <BrandRow key={b.id} b={b} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Rượu / thuốc lá ({liquorTobacco.length})
        </h2>
        <div className="space-y-2">
          {liquorTobacco.map((b) => (
            <BrandRow key={b.id} b={b} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Lượng từ</h2>
        <div className="space-y-4">
          {Object.entries(measureByCat).map(([cat, words]) => (
            <div key={cat}>
              <h3 className="mb-1 text-xs font-semibold text-gray-500">{MW_CATEGORY_VI[cat] ?? cat}</h3>
              <div className="space-y-2">
                {words.map((w) => (
                  <MeasureRow key={w.id} w={w} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-gray-400">
        Không dùng logo/hình ảnh thương hiệu có bản quyền — chỉ phiên âm tên.
      </p>
    </div>
  );
}
