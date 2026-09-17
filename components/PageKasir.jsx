"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingCart, Plus, Minus, X, ChevronUp } from "lucide-react";
import { NEUTRAL, useTheme } from "@/lib/theme";
import { rupiah, categoryColor } from "@/lib/data";
import { PageHead, Card, Input, Btn, EmptyState, StockPill } from "@/components/ui";

export default function PageKasir({ products, cart, setCart, currentUser, onCheckout }) {
  const t = useTheme();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);

  const filtered = products.filter(
    (p) =>
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())) &&
      (!activeCat || p.category === activeCat)
  );

  function addToCart(p) {
    if (p.stock <= 0) return;
    setCart((prev) => {
      const line = prev.find((c) => c.productId === p.id);
      const curQty = line ? line.qty : 0;
      if (curQty >= p.stock) return prev;
      if (line) return prev.map((c) => (c.productId === p.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { productId: p.id, qty: 1 }];
    });
  }
  function changeQty(productId, delta) {
    setCart((prev) => {
      const p = products.find((x) => x.id === productId);
      return prev
        .map((c) => (c.productId === productId ? { ...c, qty: Math.min(p.stock, c.qty + delta) } : c))
        .filter((c) => c.qty > 0);
    });
  }
  const total = cart.reduce((s, c) => {
    const p = products.find((x) => x.id === c.productId);
    return s + (p ? p.price * c.qty : 0);
  }, 0);
  const itemCount = cart.reduce((s, c) => s + c.qty, 0);

  function checkout() {
    onCheckout(total);
    setCartOpen(false);
  }

  const cartLines = !cart.length ? (
    <EmptyState
      icon={ShoppingCart}
      text={
        <>
          Keranjang masih kosong
          <br />
          Pilih produk untuk mulai
        </>
      }
    />
  ) : (
    cart.map((c) => {
      const p = products.find((x) => x.id === c.productId);
      if (!p) return null;
      return (
        <div key={c.productId} className="flex items-center gap-2.5 border-b border-dashed py-2.5" style={{ borderColor: NEUTRAL.line }}>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold">{p.name}</div>
            <div className="mt-0.5 text-[11.5px]" style={{ color: NEUTRAL.textMuted }}>
              {rupiah(p.price)} / item
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1.5 rounded-full p-1" style={{ background: NEUTRAL.paper }}>
            <button onClick={() => changeQty(p.id, -1)} className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white shadow">
              <Minus size={13} />
            </button>
            <span className="min-w-[18px] text-center font-mono text-[12.5px] font-semibold">{c.qty}</span>
            <button onClick={() => changeQty(p.id, 1)} className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white shadow">
              <Plus size={13} />
            </button>
          </div>
          <div className="min-w-[74px] flex-shrink-0 text-right font-mono text-[12.5px] font-semibold">{rupiah(p.price * c.qty)}</div>
        </div>
      );
    })
  );

  return (
    <div>
      <PageHead title="Kasir" sub="Pilih produk untuk menambahkan ke keranjang" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="relative mb-3.5">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: NEUTRAL.textMuted }} />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk..." className="pl-10" />
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {["", ...categories].map((c) => (
              <button
                key={c || "all"}
                onClick={() => setActiveCat(c)}
                className="flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
                style={
                  activeCat === c
                    ? { background: t.ink, color: "#fff" }
                    : { background: "#fff", color: NEUTRAL.textMuted, border: `1px solid ${NEUTRAL.line}` }
                }
              >
                {c || "Semua"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((p) => {
              const line = cart.find((c) => c.productId === p.id);
              return (
                <button
                  key={p.id}
                  disabled={p.stock <= 0}
                  onClick={() => addToCart(p)}
                  className="relative rounded-2xl p-3.5 text-left transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                  style={{ background: NEUTRAL.panel, border: `1px solid ${NEUTRAL.line}`, boxShadow: "0 1px 2px rgba(20,20,15,.05)" }}
                >
                  {line && (
                    <span
                      className="absolute -right-1.5 -top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: t.primary, color: t.ink, boxShadow: "0 2px 6px rgba(0,0,0,.2)" }}
                    >
                      {line.qty}
                    </span>
                  )}
                  <div
                    className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-[10px] font-bold text-white"
                    style={{ background: categoryColor(p.category) }}
                  >
                    {p.name.trim()[0].toUpperCase()}
                  </div>
                  <div className="mb-0.5 min-h-[34px] text-[13.5px] font-semibold leading-snug">{p.name}</div>
                  <div className="mb-2.5 text-[11px]" style={{ color: NEUTRAL.textMuted }}>
                    {p.category}
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed pt-2.5" style={{ borderColor: NEUTRAL.line }}>
                    <span className="font-mono text-sm font-semibold">{rupiah(p.price)}</span>
                    <StockPill stock={p.stock} minStock={p.minStock} />
                  </div>
                </button>
              );
            })}
            {!filtered.length && (
              <div className="col-span-full">
                <EmptyState text="Tidak ada produk yang cocok." />
              </div>
            )}
          </div>
        </div>

        {/* Desktop: cart stays pinned beside the product grid */}
        <Card className="sticky top-5 hidden self-start overflow-hidden !p-0 lg:block">
          <div className="flex items-center justify-between text-white" style={{ background: t.ink, padding: "16px 18px" }}>
            <div className="flex items-center gap-2 text-[14.5px] font-bold">
              <ShoppingCart size={18} style={{ color: t.primary }} /> Keranjang
            </div>
            <span className="rounded-full px-2.5 py-1 font-mono text-[11.5px] font-semibold" style={{ background: "rgba(255,255,255,.14)" }}>
              {itemCount} item
            </span>
          </div>
          <div className="text-[11px] text-white/60" style={{ background: t.inkSoft, borderBottom: "1px solid rgba(255,255,255,.08)", padding: "9px 18px" }}>
            Kasir: {currentUser.name}
          </div>
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto" style={{ padding: "14px 18px 0" }}>
            {cartLines}
          </div>
          <div style={{ padding: "14px 18px 18px" }}>
            <div className="mt-1.5 flex items-baseline justify-between border-t-2 pt-3" style={{ borderColor: t.ink }}>
              <span className="text-sm font-medium">Total</span>
              <span className="font-mono text-xl font-bold">{rupiah(total)}</span>
            </div>
            <Btn disabled={!cart.length} onClick={checkout} className="mt-3.5 w-full">
              Bayar & Selesaikan
            </Btn>
          </div>
        </Card>
      </div>

      {/* Mobile/tablet: floating cart bar, always reachable regardless of scroll — opens a bottom sheet */}
      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 items-center gap-3 rounded-2xl px-4 py-3.5 text-white transition active:scale-[.98] lg:hidden"
          style={{ background: t.ink, boxShadow: "0 10px 30px rgba(0,0,0,.3)" }}
        >
          <span
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold"
            style={{ background: t.primary, color: t.ink }}
          >
            {itemCount}
          </span>
          <span className="flex-1 truncate text-left text-[13.5px] font-semibold">Lihat Keranjang</span>
          <span className="font-mono text-[14px] font-bold" style={{ color: t.primary }}>
            {rupiah(total)}
          </span>
          <ChevronUp size={18} className="flex-shrink-0" style={{ color: t.primary }} />
        </button>
      )}

      {/* Mobile/tablet: bottom-sheet cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden" style={{ background: "rgba(20,25,28,.5)" }} onMouseDown={(e) => { if (e.target === e.currentTarget) setCartOpen(false); }}>
          <div
            className="flex max-h-[85vh] w-full flex-col rounded-t-[24px] bg-white"
            style={{ boxShadow: "0 -24px 60px rgba(0,0,0,.35)" }}
          >
            <div className="flex items-center justify-between text-white" style={{ background: t.ink, padding: "16px 18px", borderRadius: "24px 24px 0 0" }}>
              <div className="flex items-center gap-2 text-[14.5px] font-bold">
                <ShoppingCart size={18} style={{ color: t.primary }} /> Keranjang
                <span className="ml-1 rounded-full px-2.5 py-1 font-mono text-[11.5px] font-semibold" style={{ background: "rgba(255,255,255,.14)" }}>
                  {itemCount} item
                </span>
              </div>
              <button onClick={() => setCartOpen(false)} className="rounded-lg p-1 text-white/70 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain" style={{ padding: "10px 18px 0" }}>
              {cartLines}
            </div>
            <div
              className="flex-shrink-0"
              style={{ padding: "14px 18px calc(18px + env(safe-area-inset-bottom))", borderTop: `1px solid ${NEUTRAL.line}` }}
            >
              <div className="flex items-baseline justify-between pb-3">
                <span className="text-sm font-medium">Total</span>
                <span className="font-mono text-xl font-bold">{rupiah(total)}</span>
              </div>
              <Btn disabled={!cart.length} onClick={checkout} className="w-full">
                Bayar & Selesaikan
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
