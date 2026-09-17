// Penyimpanan sederhana berbasis localStorage untuk prototype ini.
// Data hanya tersimpan di browser/perangkat masing-masing (belum sinkron
// antar perangkat). Untuk produksi, ganti fungsi-fungsi ini dengan
// panggilan ke backend/database sungguhan (mis. Supabase, Postgres, dsb).

export function storeGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function storeSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // storage bisa gagal (mis. private browsing / kuota penuh) — diabaikan untuk demo
  }
}
