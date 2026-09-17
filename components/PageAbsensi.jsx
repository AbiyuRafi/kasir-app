"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Clock } from "lucide-react";
import { NEUTRAL, useTheme } from "@/lib/theme";
import { uid } from "@/lib/data";
import { PageHead, Card, Field, Select, Btn, EmptyState } from "@/components/ui";

export default function PageAbsensi({ shifts, attendance, setAttendance, currentUser }) {
  const t = useTheme();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [camStatus, setCamStatus] = useState("loading");
  const [shiftId, setShiftId] = useState(shifts[0]?.id || "");
  const [type, setType] = useState("masuk");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamStatus("ready");
      } catch (e) {
        setCamStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      if (streamRef.current) streamRef.current.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current,
      canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 360;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL("image/jpeg", 0.7);
    const shift = shifts.find((s) => s.id === shiftId);
    setAttendance((prev) => [
      {
        id: uid(),
        userId: currentUser.id,
        userName: currentUser.name,
        shiftId,
        shiftName: shift ? shift.name : "—",
        type,
        timestamp: new Date().toISOString(),
        photo,
      },
      ...prev,
    ]);
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const mine = attendance.filter((a) => a.userId === currentUser.id && new Date(a.timestamp) >= startOfDay);

  return (
    <div>
      <PageHead title="Absensi" sub="Ambil foto saat check-in / check-out" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
        <Card style={{ padding: 18 }}>
          <Field label="Shift">
            <Select value={shiftId} onChange={(e) => setShiftId(e.target.value)}>
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.start}–{s.end})
                </option>
              ))}
            </Select>
          </Field>
          <div className="mb-3.5 flex gap-2">
            {["masuk", "pulang"].map((tp) => (
              <button
                key={tp}
                onClick={() => setType(tp)}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition"
                style={
                  type === tp
                    ? { border: `1px solid ${t.primary}`, background: t.primaryBg, color: t.primaryDark }
                    : { border: `1px solid ${NEUTRAL.line}`, color: NEUTRAL.textMuted, background: "#fff" }
                }
              >
                {tp === "masuk" ? "Check-in" : "Check-out"}
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl" style={{ background: t.ink }}>
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {camStatus !== "ready" && (
              <div className="absolute inset-0 flex items-center justify-center p-5 text-center text-[13px] text-white/70">
                {camStatus === "loading" ? "Mengaktifkan kamera..." : "Tidak bisa mengakses kamera. Izinkan akses kamera di browser Anda."}
              </div>
            )}
          </div>
          <Btn disabled={camStatus !== "ready"} onClick={capture} className="mt-3.5 w-full">
            <Camera size={16} /> Ambil Foto & Catat
          </Btn>
          <p className="mt-2.5 text-[11.5px] leading-relaxed" style={{ color: NEUTRAL.textMuted }}>
            Foto tersimpan sebagai bukti kehadiran, tercatat otomatis atas nama akun yang sedang login.
          </p>
        </Card>

        <Card style={{ padding: 18 }}>
          <div className="mb-3 text-[15px] font-bold">Riwayat Saya Hari Ini</div>
          {!mine.length ? (
            <EmptyState icon={Clock} text="Belum ada catatan absensi hari ini." />
          ) : (
            mine.map((a) => (
              <div key={a.id} className="flex items-center gap-3 border-b py-2.5" style={{ borderColor: NEUTRAL.line }}>
                <img src={a.photo} alt="" className="h-[46px] w-[46px] rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-[13.5px] font-semibold">{a.shiftName}</div>
                  <div className="text-xs" style={{ color: NEUTRAL.textMuted }}>
                    {new Date(a.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                  style={a.type === "masuk" ? { background: NEUTRAL.greenBg, color: NEUTRAL.green } : { background: "#EFE9E0", color: "#8A6D2F" }}
                >
                  {a.type === "masuk" ? "Masuk" : "Pulang"}
                </span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
