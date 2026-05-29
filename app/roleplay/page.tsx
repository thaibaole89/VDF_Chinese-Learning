import Link from "next/link";
import { getAllRoleplays, getDialogueById } from "@/lib/content";
import RoleplayCard from "@/components/RoleplayCard";

export default function RoleplayPage() {
  const roleplays = getAllRoleplays();

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Đóng vai</h1>
        <p className="text-sm text-gray-500">
          Tự luyện với tình huống và câu mẫu. (Phiên bản 1 chưa có AI mô phỏng.)
        </p>
      </header>

      {roleplays.length === 0 ? (
        <p className="text-sm text-gray-400">Chưa có tình huống đóng vai.</p>
      ) : (
        <div className="space-y-3">
          {roleplays.map((rp) => (
            <RoleplayCard
              key={rp.id}
              roleplay={rp}
              sampleDialogue={getDialogueById(rp.sampleDialogueId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
