import type { RiskLevel } from "@/lib/types";

export default function RiskBadge({ riskLevel }: { riskLevel?: RiskLevel }) {
  if (riskLevel === "use_with_care") {
    return (
      <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
        Cần xác nhận
      </span>
    );
  }
  if (riskLevel === "avoid_for_customer") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
        Không dùng với khách
      </span>
    );
  }
  return null;
}
