import Link from "next/link";
import { getBrandsByCategory, getMeasureWordsByCategory } from "@/lib/content";
import { getVisualForReference } from "@/lib/visuals";
import type { BrandReference, MeasureWord } from "@/lib/types";
import ChineseLine from "@/components/ChineseLine";
import Visual from "@/components/Visual";

const MW_CATEGORY_VI: Record<string, string> = {
  beauty: "Mỹ phẩm",
  liquor_tobacco_sweets: "Rượu / thuốc lá / bánh kẹo",
  fashion: "Thời trang",
  general: "Chung",
};

function BrandRow({ b }: { b: BrandReference }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <div className="text-sm font-semibold text-ink">
        {b.latinName}
        {b.origin ? <span className="font-normal text-gray-400"> · {b.origin}</span> : null}
      </div>
      {/* References always show pinyin (this is a pronunciation lookup). */}
      <ChineseLine zh={b.hanzi} pinyin={b.pinyin} showPinyin audioText={b.audioText} noteVi={b.noteVi} size="md" />
    </div>
  );
}

function MeasureRow({ w }: { w: MeasureWord }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <ChineseLine zh={w.hanzi} pinyin={w.pinyin} vi={w.usesForVi} showPinyin size="md" />
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
        <Visual asset={getVisualForReference("brand")} variant="header" rounded />
        <h2 className="mb-2 mt-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
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
        <Visual asset={getVisualForReference("measure_word")} variant="header" rounded />
        <h2 className="mb-2 mt-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Lượng từ</h2>
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
