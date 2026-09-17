"use client";

import { LayoutDashboard, ShoppingCart, Package, Clock, Users, FileText, LogOut } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function Sidebar({ page, setPage, currentUser, onLogout, isOwner }) {
  const t = useTheme();
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, ownerOnly: true },
    { id: "kasir", label: "Kasir", icon: ShoppingCart },
    { id: "inventori", label: "Inventori", icon: Package },
    { id: "absensi", label: "Absensi", icon: Clock },
    { id: "laporan", label: "Laporan", icon: FileText, ownerOnly: true },
    { id: "team", label: "Tim & Shift", icon: Users, ownerOnly: true },
  ];
  return (
    <nav className="hidden w-56 flex-shrink-0 flex-col p-3.5 text-white lg:flex" style={{ background: t.ink }}>
      <div className="flex items-center gap-2 px-2 pb-4 pt-1 font-display text-lg font-bold">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg font-bold"
          style={{ background: `linear-gradient(145deg, ${t.primary}, ${t.primaryDark})`, color: t.ink }}
        >
          K
        </span>
        Kasir<span style={{ color: t.primary }}>ku</span>
      </div>
      <div className="mb-4 flex items-center gap-2.5 rounded-xl p-2.5" style={{ background: "rgba(255,255,255,.06)" }}>
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: t.primary, color: t.ink }}
        >
          {currentUser.name.trim()[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-white">{currentUser.name}</div>
          <div className="truncate text-[11px] text-white/50">
            {currentUser.position}
            {isOwner ? " · Owner" : ""}
          </div>
        </div>
      </div>

      {items
        .filter((it) => !it.ownerOnly || isOwner)
        .map((it) => {
          const active = page === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setPage(it.id)}
              className="relative mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium transition"
              style={{ background: active ? `${t.primary}29` : "transparent", color: active ? t.primary : "#C9C6BA" }}
            >
              {active && <span className="absolute -left-3.5 top-2 bottom-2 w-[3px] rounded-r" style={{ background: t.primary }} />}
              <it.icon size={17} />
              {it.label}
            </button>
          );
        })}

      <div className="mt-auto pt-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
          style={{ border: "1px solid rgba(255,255,255,.14)" }}
        >
          <LogOut size={15} /> Keluar
        </button>
      </div>
    </nav>
  );
}
