"use client";

import { LayoutDashboard, ShoppingCart, Package, Clock, Users } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function BottomNav({ page, setPage, isOwner }) {
  const t = useTheme();
  const items = [
    { id: "dashboard", label: "Dasbor", icon: LayoutDashboard, ownerOnly: true },
    { id: "kasir", label: "Kasir", icon: ShoppingCart },
    { id: "inventori", label: "Stok", icon: Package },
    { id: "absensi", label: "Absen", icon: Clock },
    { id: "team", label: "Tim", icon: Users, ownerOnly: true },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden"
      style={{ background: t.ink, boxShadow: "0 -6px 20px rgba(0,0,0,.15)" }}
    >
      {items
        .filter((it) => !it.ownerOnly || isOwner)
        .map((it) => {
          const active = page === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setPage(it.id)}
              className="flex flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold"
              style={{ color: active ? t.primary : "#9C998D", background: active ? `${t.primary}1F` : "transparent" }}
            >
              <it.icon size={18} />
              {it.label}
            </button>
          );
        })}
    </div>
  );
}
