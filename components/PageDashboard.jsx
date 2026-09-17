"use client";

import { useState } from "react";
import { Wallet, Receipt, Users, AlertTriangle } from "lucide-react";
import { NEUTRAL, useTheme } from "@/lib/theme";
import { rupiah, todayISO } from "@/lib/data";
import { PageHead, Card, Input, Select, StatCard, EmptyState } from "@/components/ui";

export default function PageDashboard({ products, users, shifts, attendance, transactions }) {
  const t = useTheme();
  const [date, setDate] = useState(todayISO());
  const [shiftFilter, setShiftFilter] = useState("");
  const [empFilter, setEmpFilter] = useState("");

  const sameDate = (iso) => iso.slice(0, 10) === date;
  const todaysTrx = transactions.filter((tx) => sameDate(tx.timestamp));
  const todaysAtt = attendance.filter((a) => sameDate(a.timestamp));
  let filteredAtt = todaysAtt;
  if (shiftFilter) filteredAtt = filteredAtt.filter((a) => a.shiftId === shiftFilter);
  if (empFilter) filteredAtt = filteredAtt.filter((a) => a.userId === empFilter);

  return (
    <div>
      <PageHead title="Dashboard" sub="Ringkasan operasional toko hari ini" />
      <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard icon={Wallet} tint={t.primaryBg} value={rupiah(todaysTrx.reduce((s, x) => s + x.total, 0))} label="Penjualan hari ini" />
        <StatCard icon={Receipt} tint={t.primaryBg} value={todaysTrx.length} label="Transaksi hari ini" />
        <StatCard icon={Users} tint={t.primaryBg} value={new Set(todaysAtt.map((a) => a.userId)).size} label="Karyawan absen hari ini" />
        <StatCard icon={AlertTriangle} warn value={products.filter((p) => p.stock <= p.minStock).length} label="Produk stok rendah" />
      </div>

      <Card className="mb-4" style={{ padding: 18 }}>
        <div className="mb-3 text-[15px] font-bold">Absensi Karyawan</div>
        <div className="mb-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)}>
            <option value="">Semua shift</option>
            {shifts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select value={empFilter} onChange={(e) => setEmpFilter(e.target.value)}>
            <option value="">Semua karyawan</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                <th className="pb-2">Foto</th>
                <th className="pb-2">Nama</th>
                <th className="pb-2">Shift</th>
                <th className="pb-2">Tipe</th>
                <th className="pb-2">Jam</th>
              </tr>
            </thead>
            <tbody>
              {filteredAtt.map((a) => (
                <tr key={a.id} style={{ borderTop: `1px solid ${NEUTRAL.line}` }}>
                  <td className="py-2">
                    <img src={a.photo} className="h-[38px] w-[38px] rounded-lg object-cover" alt="" />
                  </td>
                  <td className="py-2 font-semibold">{a.userName}</td>
                  <td className="py-2">
                    <span className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: "#E9F1F8", color: "#3B6FA0" }}>
                      {a.shiftName}
                    </span>
                  </td>
                  <td className="py-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                      style={a.type === "masuk" ? { background: NEUTRAL.greenBg, color: NEUTRAL.green } : { background: "#EFE9E0", color: "#8A6D2F" }}
                    >
                      {a.type === "masuk" ? "Masuk" : "Pulang"}
                    </span>
                  </td>
                  <td className="py-2 font-mono">{new Date(a.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredAtt.length && <EmptyState text="Tidak ada catatan absensi untuk filter ini." />}
        </div>
      </Card>

      <Card style={{ padding: 18 }}>
        <div className="mb-3 text-[15px] font-bold">Transaksi Terbaru</div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                <th className="pb-2">Waktu</th>
                <th className="pb-2">Kasir</th>
                <th className="pb-2">Item</th>
                <th className="pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {todaysTrx.slice(0, 10).map((tx) => (
                <tr key={tx.id} style={{ borderTop: `1px solid ${NEUTRAL.line}` }}>
                  <td className="py-2 font-mono">{new Date(tx.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="py-2">{tx.cashierName}</td>
                  <td className="py-2">{tx.items.reduce((s, i) => s + i.qty, 0)} item</td>
                  <td className="py-2 font-mono">{rupiah(tx.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!todaysTrx.length && <EmptyState text="Belum ada transaksi." />}
        </div>
      </Card>
    </div>
  );
}
