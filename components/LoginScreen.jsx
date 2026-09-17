"use client";

import { useState } from "react";
import { ShoppingCart, Camera, FileText } from "lucide-react";
import { NEUTRAL, useTheme } from "@/lib/theme";
import { Field, Input, Btn } from "@/components/ui";

export default function LoginScreen({ users, onLogin }) {
  const t = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) {
      setErr("Username atau password salah.");
      return;
    }
    setErr("");
    onLogin(found);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-0 sm:p-6" style={{ background: t.ink }}>
      <div
        className="flex w-full max-w-4xl overflow-hidden rounded-none sm:rounded-[24px]"
        style={{ background: NEUTRAL.panel, boxShadow: "0 24px 70px rgba(0,0,0,.4)", minHeight: 560 }}
      >
        <div
          className="relative hidden flex-1 flex-col justify-between p-11 text-white sm:flex"
          style={{
            background: `radial-gradient(circle at 85% 10%, ${t.gradA}, transparent 45%), radial-gradient(circle at 10% 90%, ${t.gradB}, transparent 45%), linear-gradient(160deg, ${t.ink}, ${t.inkSoft})`,
          }}
        >
          <div>
            <div className="flex items-center gap-2.5 font-display text-xl font-bold">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-[10px] font-bold"
                style={{ background: `linear-gradient(145deg, ${t.primary}, ${t.primaryDark})`, color: t.ink }}
              >
                K
              </span>
              Kasir<span style={{ color: t.primary }}>ku</span>
            </div>
            <h2 className="mt-10 font-display text-[27px] font-bold leading-snug">
              Kelola toko Anda
              <br />
              dalam satu layar.
            </h2>
            <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-white/70">
              Kasir, stok, shift karyawan, absensi wajah, sampai laporan laba rugi — semuanya terhubung otomatis.
            </p>
            <ul className="mt-7 flex flex-col gap-3 text-sm text-white/85">
              <li className="flex items-center gap-2.5">
                <ShoppingCart size={17} style={{ color: t.primary }} /> Kasir & stok real-time
              </li>
              <li className="flex items-center gap-2.5">
                <Camera size={17} style={{ color: t.primary }} /> Absensi wajah per shift
              </li>
              <li className="flex items-center gap-2.5">
                <FileText size={17} style={{ color: t.primary }} /> Laporan penjualan & laba rugi
              </li>
            </ul>
          </div>
          <div className="text-xs text-white/40">© 2026 Kasirku — Prototipe demo</div>
        </div>

        <div className="flex flex-1 items-center justify-center p-7 sm:p-11">
          <form onSubmit={submit} className="w-full max-w-[320px]">
            <div className="mb-7 flex items-center gap-2 sm:hidden">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg font-bold"
                style={{ background: `linear-gradient(145deg, ${t.primary}, ${t.primaryDark})`, color: t.ink }}
              >
                K
              </span>
              <span className="font-display text-lg font-bold">
                Kasir<span style={{ color: t.primary }}>ku</span>
              </span>
            </div>
            <div className="font-display text-[22px] font-bold" style={{ color: NEUTRAL.text }}>
              Selamat datang kembali
            </div>
            <div className="mb-6 mt-1 text-sm" style={{ color: NEUTRAL.textMuted }}>
              Masuk dengan akun Anda untuk mulai kerja
            </div>
            {err && (
              <div className="mb-3.5 rounded-lg px-3 py-2 text-xs font-medium" style={{ background: NEUTRAL.redBg, color: NEUTRAL.red }}>
                {err}
              </div>
            )}
            <Field label="Username">
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="mis. owner" autoComplete="username" />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>
            <Btn type="submit" className="w-full">
              Masuk
            </Btn>
            <div className="mt-5 rounded-xl p-3.5 text-xs leading-[1.8]" style={{ background: t.primaryBg, border: `1px solid ${t.primary}33`, color: t.primaryDark }}>
              <div className="mb-1 font-bold">Akun demo untuk uji coba</div>
              Owner &nbsp;→ <code className="rounded bg-white/60 px-1.5">owner</code> / <code className="rounded bg-white/60 px-1.5">owner123</code>
              <br />
              Kasir &nbsp;→ <code className="rounded bg-white/60 px-1.5">abi</code> / <code className="rounded bg-white/60 px-1.5">abi123</code>
              <br />
              Gudang → <code className="rounded bg-white/60 px-1.5">rafi</code> / <code className="rounded bg-white/60 px-1.5">rafi123</code>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
