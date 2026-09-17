"use client";

import { X } from "lucide-react";
import { NEUTRAL, useTheme } from "@/lib/theme";

export function Btn({ variant = "primary", className = "", style, children, ...rest }) {
  const t = useTheme();
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[.97] disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: { background: t.primary, color: t.ink, boxShadow: `0 3px 10px ${t.primary}55` },
    ghost: { background: "transparent", color: NEUTRAL.text, border: `1px solid ${NEUTRAL.line}` },
    dangerGhost: { background: NEUTRAL.redBg, color: NEUTRAL.red },
  };
  return (
    <button className={base + " " + className} style={{ ...styles[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}

export function Card({ className = "", style, children }) {
  return (
    <div
      className={"rounded-2xl " + className}
      style={{ background: NEUTRAL.panel, border: `1px solid ${NEUTRAL.line}`, boxShadow: "0 1px 2px rgba(20,20,15,.05)", ...style }}
    >
      {children}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-xs font-semibold" style={{ color: NEUTRAL.textMuted }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function Input(props) {
  const t = useTheme();
  return (
    <input
      {...props}
      className={"w-full rounded-lg px-3 py-2.5 text-sm outline-none transition " + (props.className || "")}
      style={{ border: `1.5px solid ${NEUTRAL.line}`, background: "#fff", color: NEUTRAL.text }}
      onFocus={(e) => (e.target.style.borderColor = t.primary)}
      onBlur={(e) => (e.target.style.borderColor = NEUTRAL.line)}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
      style={{ border: `1.5px solid ${NEUTRAL.line}`, color: NEUTRAL.text }}
    >
      {children}
    </select>
  );
}

export function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm" style={{ color: NEUTRAL.textMuted }}>
      {Icon && <Icon size={30} style={{ color: NEUTRAL.line }} />}
      <span>{text}</span>
    </div>
  );
}

export function StockPill({ stock, minStock }) {
  const low = stock <= minStock;
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ background: low ? NEUTRAL.redBg : NEUTRAL.greenBg, color: low ? NEUTRAL.red : NEUTRAL.green }}
    >
      {stock <= 0 ? "Habis" : `${stock} stok`}
    </span>
  );
}

export function Modal({ open, onClose, title, children, width = 420 }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(20,25,28,.5)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full rounded-2xl bg-white p-6" style={{ maxWidth: width, boxShadow: "0 24px 60px rgba(0,0,0,.35)" }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: NEUTRAL.text }}>
            {title}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageHead({ title, sub, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2.5 border-b pb-4" style={{ borderColor: NEUTRAL.line }}>
      <div>
        <h1 className="font-display text-[23px] font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-[13.5px]" style={{ color: NEUTRAL.textMuted }}>
          {sub}
        </p>
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon: Icon, value, label, warn, tint }) {
  return (
    <Card className="flex flex-col gap-2.5 p-4">
      <div
        className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px]"
        style={{ background: warn ? NEUTRAL.redBg : tint, color: warn ? NEUTRAL.red : undefined }}
      >
        <Icon size={17} />
      </div>
      <div className="font-mono text-[22px] font-bold" style={{ color: warn ? NEUTRAL.red : NEUTRAL.text }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: NEUTRAL.textMuted }}>
        {label}
      </div>
    </Card>
  );
}

export function TabButton({ active, onClick, children }) {
  const t = useTheme();
  return (
    <button
      onClick={onClick}
      className="pb-2.5 text-sm font-semibold"
      style={{ color: active ? NEUTRAL.text : NEUTRAL.textMuted, borderBottom: active ? `2px solid ${t.primary}` : "2px solid transparent" }}
    >
      {children}
    </button>
  );
}
