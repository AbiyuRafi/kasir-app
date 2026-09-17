"use client";

import { useState } from "react";
import { Wallet, Receipt, TrendingUp, Package } from "lucide-react";
import { NEUTRAL, useTheme } from "@/lib/theme";
import { rupiah, todayISO } from "@/lib/data";
import { PageHead, Card, Field, Input, StatCard, EmptyState, TabButton } from "@/components/ui";

export default function PageLaporan({ products, transactions }) {
  const t = useTheme();
  const [tab, setTab] = useState("penjualan");
  const weekAgo = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(weekAgo);
  const [to, setTo] = useState(todayISO());
  const [physical, setPhysical] = useState({});

  const trx = transactions.filter((tx) => {
    const d = tx.timestamp.slice(0, 10);
    return (!from || d >= from) && (!to || d <= to);
  });
  const omzet = trx.reduce((s, tx) => s + tx.total, 0);

  const byProduct = {};
  trx.forEach((tx) =>
    tx.items.forEach((i) => {
      if (!byProduct[i.productId]) byProduct[i.productId] = { name: i.name, qty: 0, omzet: 0, modal: 0 };
      byProduct[i.productId].qty += i.qty;
      byProduct[i.productId].omzet += i.qty * i.price;
      byProduct[i.productId].modal += i.qty * (i.cost || 0);
    })
  );
  const topProducts = Object.values(byProduct).sort((a, b) => b.qty - a.qty).slice(0, 8);
  const totalModal = Object.values(byProduct).reduce((s, p) => s + p.modal, 0);
  const laba = omzet - totalModal;

  const byDay = {};
  trx.forEach((tx) => {
    const d = tx.timestamp.slice(0, 10);
    byDay[d] = (byDay[d] || 0) + tx.total;
  });
  const days = Object.keys(byDay).sort();
  const maxDay = Math.max(1, ...days.map((d) => byDay[d]));

  const tabs = [
    { id: "penjualan", label: "Penjualan" },
    { id: "labarugi", label: "Laba Rugi" },
    { id: "opname", label: "Stok Opname" },
  ];

  return (
    <div>
      <PageHead title="Laporan" sub="Penjualan, laba rugi, dan cek selisih stok" />
      <div className="mb-4 flex gap-5 border-b" style={{ borderColor: NEUTRAL.line }}>
        {tabs.map((tb) => (
          <TabButton key={tb.id} active={tab === tb.id} onClick={() => setTab(tb.id)}>
            {tb.label}
          </TabButton>
        ))}
      </div>

      {(tab === "penjualan" || tab === "labarugi") && (
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-2">
          <Field label="Dari tanggal">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="Sampai tanggal">
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
      )}

      {tab === "penjualan" && (
        <>
          <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <StatCard icon={Wallet} tint={t.primaryBg} value={rupiah(omzet)} label="Total omzet" />
            <StatCard icon={Receipt} tint={t.primaryBg} value={trx.length} label="Jumlah transaksi" />
            <StatCard icon={TrendingUp} tint={t.primaryBg} value={rupiah(trx.length ? omzet / trx.length : 0)} label="Rata-rata per transaksi" />
          </div>
          <Card className="mb-4" style={{ padding: 18 }}>
            <div className="mb-3 text-[15px] font-bold">Omzet per Hari</div>
            {days.length ? (
              <div className="flex h-[130px] items-end gap-1.5 pt-2.5">
                {days.map((d) => (
                  <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      title={rupiah(byDay[d])}
                      className="w-full max-w-[34px] rounded-t"
                      style={{ height: Math.max(3, Math.round((byDay[d] / maxDay) * 100)), background: t.primary }}
                    />
                    <div className="whitespace-nowrap text-[10px]" style={{ color: NEUTRAL.textMuted }}>
                      {new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Belum ada penjualan di rentang ini." />
            )}
          </Card>
          <Card className="mb-4" style={{ padding: 18 }}>
            <div className="mb-3 text-[15px] font-bold">Produk Terlaris</div>
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                  <th className="pb-2">Produk</th>
                  <th className="pb-2">Terjual</th>
                  <th className="pb-2">Omzet</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${NEUTRAL.line}` }}>
                    <td className="py-2 font-semibold">{p.name}</td>
                    <td className="py-2 font-mono">{p.qty}</td>
                    <td className="py-2 font-mono">{rupiah(p.omzet)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!topProducts.length && <EmptyState text="Belum ada data penjualan di rentang ini." />}
          </Card>
          <Card style={{ padding: 18 }}>
            <div className="mb-3 text-[15px] font-bold">Semua Transaksi</div>
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-[13.5px]">
                <thead>
                  <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                    <th className="pb-2">Tanggal</th>
                    <th className="pb-2">Jam</th>
                    <th className="pb-2">Kasir</th>
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[...trx]
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((tx) => (
                      <tr key={tx.id} style={{ borderTop: `1px solid ${NEUTRAL.line}` }}>
                        <td className="py-2">{new Date(tx.timestamp).toLocaleDateString("id-ID")}</td>
                        <td className="py-2 font-mono">{new Date(tx.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="py-2">{tx.cashierName}</td>
                        <td className="py-2">{tx.items.reduce((s, i) => s + i.qty, 0)} item</td>
                        <td className="py-2 font-mono">{rupiah(tx.total)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {!trx.length && <EmptyState text="Belum ada transaksi di rentang ini." />}
          </Card>
        </>
      )}

      {tab === "labarugi" && (
        <>
          <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <StatCard icon={Wallet} tint={t.primaryBg} value={rupiah(omzet)} label="Omzet" />
            <StatCard icon={Package} tint={t.primaryBg} value={rupiah(totalModal)} label="Total modal terjual" />
            <StatCard icon={TrendingUp} tint={t.primaryBg} value={rupiah(laba)} label="Laba kotor" warn={laba < 0} />
          </div>
          <Card style={{ padding: 18 }}>
            <div className="mb-3 text-[15px] font-bold">Laba per Produk</div>
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                  <th className="pb-2">Produk</th>
                  <th className="pb-2">Terjual</th>
                  <th className="pb-2">Omzet</th>
                  <th className="pb-2">Modal</th>
                  <th className="pb-2">Laba</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(byProduct)
                  .sort((a, b) => b.omzet - b.modal - (a.omzet - a.modal))
                  .map((p, i) => {
                    const pLaba = p.omzet - p.modal,
                      rugi = pLaba < 0;
                    return (
                      <tr key={i} style={{ borderTop: `1px solid ${NEUTRAL.line}`, background: rugi ? NEUTRAL.redBg : "transparent" }}>
                        <td className="py-2 font-semibold">{p.name}</td>
                        <td className="py-2 font-mono">{p.qty}</td>
                        <td className="py-2 font-mono">{rupiah(p.omzet)}</td>
                        <td className="py-2 font-mono">{rupiah(p.modal)}</td>
                        <td className="py-2 font-mono font-semibold" style={{ color: rugi ? NEUTRAL.red : NEUTRAL.green }}>
                          {rupiah(pLaba)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {!Object.keys(byProduct).length && <EmptyState text="Belum ada data di rentang ini." />}
            <p className="mt-3 text-[11.5px]" style={{ color: NEUTRAL.textMuted }}>
              Baris berwarna merah berarti produk terjual di bawah harga modal (rugi). Isi kolom &quot;Harga Modal&quot; di menu Inventori agar laporan
              ini akurat.
            </p>
          </Card>
        </>
      )}

      {tab === "opname" && (
        <>
          <p className="mb-3 text-[13px]" style={{ color: NEUTRAL.textMuted }}>
            Hitung stok fisik di rak/gudang, lalu masukkan angkanya di kolom &quot;Stok Fisik&quot;. Sistem akan menghitung selisihnya otomatis.
          </p>
          <Card style={{ padding: 18 }}>
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                  <th className="pb-2">Produk</th>
                  <th className="pb-2">Stok Sistem</th>
                  <th className="pb-2">Stok Fisik</th>
                  <th className="pb-2">Selisih</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const val = physical[p.id];
                  const hasCount = val !== undefined && val !== "";
                  const diff = hasCount ? Number(val) - p.stock : null;
                  return (
                    <tr key={p.id} style={{ borderTop: `1px solid ${NEUTRAL.line}` }}>
                      <td className="py-2 font-semibold">{p.name}</td>
                      <td className="py-2 font-mono">{p.stock}</td>
                      <td className="py-2">
                        <input
                          type="number"
                          value={val ?? ""}
                          onChange={(e) => setPhysical({ ...physical, [p.id]: e.target.value })}
                          placeholder="-"
                          className="w-20 rounded-lg px-2 py-1.5 text-right text-sm"
                          style={{ border: `1.5px solid ${NEUTRAL.line}` }}
                        />
                      </td>
                      <td className="py-2">
                        {hasCount ? (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{ background: diff < 0 ? NEUTRAL.redBg : NEUTRAL.greenBg, color: diff < 0 ? NEUTRAL.red : NEUTRAL.green }}
                          >
                            {diff === 0 ? "Sesuai" : diff < 0 ? `${diff} (kurang)` : `+${diff} (lebih)`}
                          </span>
                        ) : (
                          <span style={{ color: NEUTRAL.textMuted }}>— belum dihitung</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}
