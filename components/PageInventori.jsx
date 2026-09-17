"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { NEUTRAL } from "@/lib/theme";
import { rupiah, uid } from "@/lib/data";
import { PageHead, Card, Input, Btn, EmptyState, StockPill, Modal, Field } from "@/components/ui";

export default function PageInventori({ products, setProducts }) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", cost: "", price: "", stock: "", minStock: "" });

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditId(null);
    setForm({ name: "", category: "", cost: "", price: "", stock: "", minStock: "" });
    setModalOpen(true);
  }
  function openEdit(p) {
    setEditId(p.id);
    setForm({ name: p.name, category: p.category, cost: p.cost, price: p.price, stock: p.stock, minStock: p.minStock });
    setModalOpen(true);
  }
  function save() {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || "Umum",
      cost: Number(form.cost) || 0,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
    };
    if (editId) setProducts((prev) => prev.map((p) => (p.id === editId ? { ...p, ...payload } : p)));
    else setProducts((prev) => [...prev, { id: uid(), physicalStock: null, ...payload }]);
    setModalOpen(false);
  }
  function del(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <PageHead
        title="Inventori"
        sub="Kelola produk dan pantau stok"
        action={
          <Btn onClick={openAdd}>
            <Plus size={16} /> Produk Baru
          </Btn>
        }
      />
      <Card style={{ padding: 18 }}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau kategori produk..." className="mb-3.5" />
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                <th className="pb-2.5" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>Produk</th>
                <th className="pb-2.5" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>Kategori</th>
                <th className="pb-2.5" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>Modal</th>
                <th className="pb-2.5" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>Jual</th>
                <th className="pb-2.5" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>Stok</th>
                <th className="pb-2.5" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-2.5 font-semibold" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>{p.name}</td>
                  <td className="py-2.5" style={{ borderBottom: `1px solid ${NEUTRAL.line}`, color: NEUTRAL.textMuted }}>{p.category}</td>
                  <td className="py-2.5 font-mono" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>{rupiah(p.cost)}</td>
                  <td className="py-2.5 font-mono" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>{rupiah(p.price)}</td>
                  <td className="py-2.5" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>
                    <StockPill stock={p.stock} minStock={p.minStock} />
                  </td>
                  <td className="py-2.5 text-right" style={{ borderBottom: `1px solid ${NEUTRAL.line}` }}>
                    <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => del(p.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <EmptyState icon={Package} text="Belum ada produk. Tambahkan produk pertama Anda." />}
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Produk" : "Produk Baru"}>
        <Field label="Nama Produk">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="mis. Kopi Susu 250ml" />
        </Field>
        <Field label="Kategori">
          <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="mis. Minuman" />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Harga Modal (Rp)">
            <Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          </Field>
          <Field label="Harga Jual (Rp)">
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Field>
        </div>
        <Field label="Stok Awal">
          <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </Field>
        <Field label="Stok Minimum (peringatan)">
          <Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
        </Field>
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setModalOpen(false)}>
            Batal
          </Btn>
          <Btn onClick={save}>Simpan</Btn>
        </div>
      </Modal>
    </div>
  );
}
