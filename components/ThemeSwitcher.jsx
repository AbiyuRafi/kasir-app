"use client";

import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { THEMES, NEUTRAL } from "@/lib/theme";

export default function ThemeSwitcher({ themeKey, setThemeKey }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-40 lg:bottom-5 lg:right-5">
      {open && (
        <div
          className="mb-3 w-52 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-3 lg:w-56"
          style={{ boxShadow: "0 16px 40px rgba(0,0,0,.25)", border: `1px solid ${NEUTRAL.line}` }}
        >
          <div className="mb-2 px-1 text-xs font-semibold" style={{ color: NEUTRAL.textMuted }}>
            Pilih tema warna
          </div>
          <div className="flex flex-col gap-1.5">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => {
                  setThemeKey(key);
                  setOpen(false);
                }}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-medium hover:bg-gray-50"
                style={{ color: NEUTRAL.text }}
              >
                <span className="h-6 w-6 flex-shrink-0 rounded-full" style={{ background: t.swatch }} />
                <span className="flex-1">{t.label}</span>
                {themeKey === key && <Check size={16} style={{ color: t.primary }} />}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white transition active:scale-95 lg:h-12 lg:w-12"
        style={{ background: THEMES[themeKey].ink, boxShadow: "0 8px 24px rgba(0,0,0,.3)" }}
        title="Ganti tema warna"
      >
        <Palette size={18} />
      </button>
    </div>
  );
}
