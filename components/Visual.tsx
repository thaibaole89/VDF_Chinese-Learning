import Image from "next/image";
import type { VisualAsset } from "@/lib/visuals";

// Renders an AI-placeholder visual. `header` = 16:9 hero; `thumb` = small square.
export default function Visual({
  asset,
  variant = "header",
  priority = false,
  rounded = false,
  className,
}: {
  asset?: VisualAsset;
  variant?: "header" | "thumb";
  priority?: boolean;
  rounded?: boolean;
  className?: string;
}) {
  if (!asset) return null;

  if (variant === "thumb") {
    return (
      <div className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50 ${className ?? ""}`}>
        <Image src={asset.src} alt={asset.altVi} fill sizes="56px" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[16/9] w-full overflow-hidden bg-brand-50 ${rounded ? "rounded-2xl" : ""} ${className ?? ""}`}
    >
      <Image
        src={asset.src}
        alt={asset.altVi}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, 640px"
        className="object-cover"
      />
    </div>
  );
}
