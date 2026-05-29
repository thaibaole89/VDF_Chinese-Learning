import type { ContentStatus } from "@/lib/types";

// Internal MVP: surface "needs_review" so reviewers always see what is pending.
export default function StatusBadge({ status }: { status?: ContentStatus }) {
  if (status !== "needs_review") return null;
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      Chờ duyệt
    </span>
  );
}
