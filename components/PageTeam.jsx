"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { NEUTRAL } from "@/lib/theme";
import { uid } from "@/lib/data";
import { PageHead, Card, Btn, Modal, Field, Input, TabButton } from "@/components/ui";

export default function PageTeam({ users, setUsers, shifts, setShifts }) {
  const [tab, setTab] = useState("karyawan");
  const [userModal, setUserModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [uForm, setUForm] = useState({ name: "", position: "", username: "", password: "" });
  const [shiftModal, setShiftModal] = useState(false);
  const [editShiftId, setEditShiftId] = useState(null);
  const [sForm, setSForm] = useState({ name: "", start: "", end: "" });

  function openAddUser() {
    setEditUserId(null);
    setUForm({ name: "", position: "", username: "", password: "" });
    setUserModal(true);
  }
  function openEditUser(u) {
    setEditUserId(u.id);
    setUForm({ name: u.name, position: u.position, username: u.username, password: u.password });
    setUserModal(true);
  }
  function saveUser() {
    if (!uForm.name.trim() || !uForm.username.trim() || !uForm.password) return;
    const dupe = users.find((u) => u.username === uForm.username && u.id !== editUserId);
    if (dupe) return;
    if (editUserId) setUsers((prev) => prev.map((u) => (u.id === editUserId ? { ...u, ...uForm, position: uForm.position || "Staf" } : u)));
    else setUsers((prev) => [...prev, { id: uid(), role: "karyawan", ...uForm, position: uForm.position || "Staf" }]);
    setUserModal(false);
  }
  function delUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function openAddShift() {
    setEditShiftId(null);
    setSForm({ name: "", start: "", end: "" });
    setShiftModal(true);
  }
  function openEditShift(s) {
    setEditShiftId(s.id);
    setSForm({ name: s.name, start: s.start, end: s.end });
    setShiftModal(true);
  }
  function saveShift() {
    if (!sForm.name.trim() || !sForm.start || !sForm.end) return;
    if (editShiftId) setShifts((prev) => prev.map((s) => (s.id === editShiftId ? { ...s, ...sForm } : s)));
    else setShifts((prev) => [...prev, { id: uid(), ...sForm }]);
    setShiftModal(false);
  }
  function delShift(id) {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <PageHead title="Tim & Shift" sub="Kelola akun karyawan dan jadwal shift" />
      <div className="mb-4 flex gap-5 border-b" style={{ borderColor: NEUTRAL.line }}>
        <TabButton active={tab === "karyawan"} onClick={() => setTab("karyawan")}>
          Karyawan
        </TabButton>
        <TabButton active={tab === "shift"} onClick={() => setTab("shift")}>
          Shift
        </TabButton>
      </div>

      {tab === "karyawan" && (
        <>
          <div className="mb-3.5 flex justify-end">
            <Btn onClick={openAddUser}>
              <Plus size={16} /> Karyawan
            </Btn>
          </div>
          <Card style={{ padding: 18 }}>
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                  <th className="pb-2">Nama</th>
                  <th className="pb-2">Posisi</th>
                  <th className="pb-2">Username</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderTop: `1px solid ${NEUTRAL.line}` }}>
                    <td className="py-2.5 font-semibold">{u.name}</td>
                    <td className="py-2.5" style={{ color: NEUTRAL.textMuted }}>
                      {u.position}
                    </td>
                    <td className="py-2.5 font-mono">{u.username}</td>
                    <td className="py-2.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                        style={u.role === "owner" ? { background: "#FBF6E7", color: "#9C7D1D" } : { background: "#E9F1F8", color: "#3B6FA0" }}
                      >
                        {u.role === "owner" ? "Owner" : "Karyawan"}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => openEditUser(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        <Pencil size={15} />
                      </button>
                      {u.role !== "owner" && (
                        <button onClick={() => delUser(u.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === "shift" && (
        <>
          <div className="mb-3.5 flex justify-end">
            <Btn onClick={openAddShift}>
              <Plus size={16} /> Shift
            </Btn>
          </div>
          <Card style={{ padding: 18 }}>
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="text-left text-[11.5px] font-semibold" style={{ color: NEUTRAL.textMuted }}>
                  <th className="pb-2">Nama Shift</th>
                  <th className="pb-2">Mulai</th>
                  <th className="pb-2">Selesai</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <tr key={s.id} style={{ borderTop: `1px solid ${NEUTRAL.line}` }}>
                    <td className="py-2.5 font-semibold">{s.name}</td>
                    <td className="py-2.5 font-mono">{s.start}</td>
                    <td className="py-2.5 font-mono">{s.end}</td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => openEditShift(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => delShift(s.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      <Modal open={userModal} onClose={() => setUserModal(false)} title={editUserId ? "Edit Karyawan" : "Karyawan Baru"}>
        <Field label="Nama">
          <Input value={uForm.name} onChange={(e) => setUForm({ ...uForm, name: e.target.value })} placeholder="mis. Siti Aminah" />
        </Field>
        <Field label="Posisi">
          <Input value={uForm.position} onChange={(e) => setUForm({ ...uForm, position: e.target.value })} placeholder="mis. Kasir" />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Username">
            <Input value={uForm.username} onChange={(e) => setUForm({ ...uForm, username: e.target.value.toLowerCase() })} placeholder="mis. siti" />
          </Field>
          <Field label="Password">
            <Input value={uForm.password} onChange={(e) => setUForm({ ...uForm, password: e.target.value })} placeholder="mis. siti123" />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setUserModal(false)}>
            Batal
          </Btn>
          <Btn onClick={saveUser}>Simpan</Btn>
        </div>
      </Modal>

      <Modal open={shiftModal} onClose={() => setShiftModal(false)} title={editShiftId ? "Edit Shift" : "Shift Baru"}>
        <Field label="Nama Shift">
          <Input value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} placeholder="mis. Shift Pagi" />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Jam Mulai">
            <Input type="time" value={sForm.start} onChange={(e) => setSForm({ ...sForm, start: e.target.value })} />
          </Field>
          <Field label="Jam Selesai">
            <Input type="time" value={sForm.end} onChange={(e) => setSForm({ ...sForm, end: e.target.value })} />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setShiftModal(false)}>
            Batal
          </Btn>
          <Btn onClick={saveShift}>Simpan</Btn>
        </div>
      </Modal>
    </div>
  );
}
