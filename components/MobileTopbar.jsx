"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { NEUTRAL, useTheme } from "@/lib/theme";

export default function MobileTopbar({ currentUser, onLogout, isOwner }) {
  const t = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 text-white lg:hidden"
        style={{ background: t.ink, boxShadow: "0 2px 10px rgba(0,0,0,.12)" }}
      >
        <div className="flex items-center gap-2 font-display text-[15px] font-bold">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg font-bold"
            style={{ background: `linear-gradient(145deg, ${t.primary}, ${t.primaryDark})`, color: t.ink }}
          >
            K
          </span>
          Kasir<span style={{ color: t.primary }}>ku</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: t.primary, color: t.ink }}
            >
              {currentUser.name.trim()[0].toUpperCase()}
            </div>
            <div className="max-w-[92px] truncate text-[12px] font-semibold leading-tight">
              {currentUser.name}
            </div>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/70 transition active:scale-95"
            style={{ border: "1px solid rgba(255,255,255,.18)" }}
            title="Keluar"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-5 lg:hidden"
          style={{ background: "rgba(20,25,28,.5)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmOpen(false);
          }}
        >
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-5" style={{ boxShadow: "0 24px 60px rgba(0,0,0,.35)" }}>
            <div className="mb-1.5 text-[15px] font-bold" style={{ color: NEUTRAL.text }}>
              Keluar dari akun?
            </div>
            <p className="mb-4 text-[13px]" style={{ color: NEUTRAL.textMuted }}>
              Anda akan keluar sebagai {currentUser.name}
              {isOwner ? " (Owner)" : ""}.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={{ border: `1px solid ${NEUTRAL.line}`, color: NEUTRAL.text }}
              >
                Batal
              </button>
              <button
                onClick={onLogout}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                style={{ background: NEUTRAL.red }}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
