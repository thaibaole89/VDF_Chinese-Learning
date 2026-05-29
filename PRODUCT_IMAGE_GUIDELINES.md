# Product & Visual Image Guidelines — VDF Chinese Sales Tutor

**Status:** the images currently in `public/visuals/` are **AI-placeholder visuals**
(`approvalStatus: "placeholder"`). In this build they are clean brand-gradient
placeholders because no image-generation capability (Gemini / "Nano Banana") was
connected; rerun `node scripts/gen-visuals.mjs` with a `GEMINI_API_KEY` to produce
the real illustrations (same filenames). They are illustrative only and must be
reviewed by VDF before any official training use.

## Why real product photos help (later)
Real, rights-cleared product photos can improve recognition and learning
effectiveness for staff. They are **optional** and must never be scraped.

## Allowed sources ONLY
1. **VDF-owned photos** taken in store / warehouse.
2. **Brand/vendor-approved** marketing assets (with written permission).
3. **CDF / vendor catalog** assets **if rights explicitly allow** internal use.

## Never
- Do **not** scrape from Google, marketplaces, social media, or brand websites.
- Do **not** use real logos or trademarked product packaging unless VDF has
  explicit rights.
- Do **not** use celebrity/person likeness, real passport/boarding-pass data,
  real credit-card numbers, or scannable QR codes.

## Future folder + metadata (when real photos are approved)
```
public/product-images/<category>/<sku-or-slug>.webp
```
Extend the visual metadata with:
- `visual.productPhotoSrc`   — path to the approved photo
- `visual.source`            — "vdf_owned" | "vendor_approved" | "catalog_licensed"
- `visual.approvalStatus`    — "pending" | "approved" | "rejected"
- `visual.rightsNoteVi`      — rights note / approver
- `visual.fileSizeKb`        — optimized size

**Show a real product photo only when `approvalStatus === "approved"`.** Until
then, fall back to the AI placeholder.

## Format / size targets
- Prefer **WebP**; optimized PNG only if WebP tooling is unavailable.
- Hero: 768×432. Thumbnails: CSS-crop the same image (no separate huge duplicates).
- Each image ≤ 80 KB ideally, hard max 150 KB. Total `public/visuals` ≤ 1.5 MB.
- Do not commit large raw source images or generation intermediates.
