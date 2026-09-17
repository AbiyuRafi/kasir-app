# Kasirku — Next.js

Aplikasi kasir, inventori, shift, absensi wajah, dan laporan untuk demo ke client.
Dibangun dengan **Next.js 14 (App Router)**, **Tailwind CSS**, dan **lucide-react**.

## Menjalankan di komputer Anda

```bash
npm install
npm run dev
```

Lalu buka [http://localhost:3000](http://localhost:3000) di browser.

## Akun demo

| Role   | Username | Password   |
| ------ | -------- | ---------- |
| Owner  | `owner`  | `owner123` |
| Kasir  | `abiyu`  | `abiyu123` |
| Gudang | `rafi`   | `rafi123`  |

## Fitur

- **Login per akun** — 1 karyawan 1 akun, dengan role Owner / Karyawan.
- **Kasir (POS)** — pencarian produk, filter kategori, keranjang, checkout otomatis mengurangi stok.
- **Inventori** — tambah/edit/hapus produk, harga modal (HPP), harga jual, dan stok minimum.
- **Absensi wajah** — ambil foto lewat kamera saat check-in/check-out, per shift, tercatat atas nama akun yang login.
- **Dashboard** (khusus Owner) — ringkasan penjualan, transaksi, karyawan yang absen, dan stok rendah hari ini.
- **Laporan** (khusus Owner) — Penjualan (omzet, grafik, produk terlaris), Laba Rugi (per produk, menandai yang rugi), dan Stok Opname (cek selisih stok fisik vs sistem).
- **Tim & Shift** (khusus Owner) — kelola akun karyawan dan jadwal shift.
- **3 pilihan tema warna** — Gold Elegan, Biru Modern, Hijau Emerald. Bisa diganti langsung dari tombol palet di pojok kanan bawah.

## Struktur project

```
app/
  layout.jsx        Root layout + font & metadata
  page.jsx           Entry point, merender <KasirkuApp />
  globals.css         Tailwind + font import
components/
  KasirkuApp.jsx      Komponen utama: state global & routing halaman
  LoginScreen.jsx
  Sidebar.jsx / BottomNav.jsx
  PageKasir.jsx
  PageInventori.jsx
  PageAbsensi.jsx
  PageDashboard.jsx
  PageLaporan.jsx
  PageTeam.jsx
  ThemeSwitcher.jsx
  ui.jsx              Komponen UI dasar (Button, Card, Modal, dll)
lib/
  theme.js            Definisi 3 tema warna + context
  data.js             Helper, seed data, storage keys
  storage.js          Wrapper localStorage
```

## Catatan penting untuk produksi

Project ini adalah **prototipe untuk demo**:

- Data (produk, karyawan, transaksi, absensi) disimpan di **localStorage browser** — hanya tersimpan di satu perangkat/browser, belum sinkron antar perangkat, dan akan hilang jika cache browser dibersihkan.
- Password akun disimpan sebagai teks biasa (tanpa enkripsi) — cukup untuk demo, **tidak aman untuk produksi**.
- Kamera memerlukan akses **HTTPS** di luar `localhost` (browser memblokir akses kamera di HTTP biasa).

Untuk lanjut ke tahap produksi, langkah berikutnya:

1. Ganti `lib/storage.js` dengan panggilan ke backend/database sungguhan (mis. Supabase, PostgreSQL + Prisma, atau Firebase).
2. Tambahkan hashing password & sesi login yang aman (mis. NextAuth.js).
3. Deploy ke hosting dengan HTTPS otomatis (mis. Vercel).
