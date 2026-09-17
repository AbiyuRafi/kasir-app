"use client";

import { useEffect, useState } from "react";
import { THEMES, NEUTRAL, ThemeCtx } from "@/lib/theme";
import { seedProducts, seedUsers, seedShifts, uid, rupiah, K } from "@/lib/data";
import { storeGet, storeSet } from "@/lib/storage";

import LoginScreen from "@/components/LoginScreen";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import MobileTopbar from "@/components/MobileTopbar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import PageDashboard from "@/components/PageDashboard";
import PageKasir from "@/components/PageKasir";
import PageInventori from "@/components/PageInventori";
import PageAbsensi from "@/components/PageAbsensi";
import PageLaporan from "@/components/PageLaporan";
import PageTeam from "@/components/PageTeam";

export default function KasirkuApp() {
  const [themeKey, setThemeKey] = useState("gold");
  const [booted, setBooted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("kasir");
  const [toast, setToast] = useState("");

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cart, setCart] = useState([]);

  // load persisted state once (client only)
  useEffect(() => {
    const p = storeGet(K.products, null) || seedProducts();
    const u = storeGet(K.users, null) || seedUsers();
    const s = storeGet(K.shifts, null) || seedShifts();
    const a = storeGet(K.attendance, []);
    const tx = storeGet(K.transactions, []);
    const sess = storeGet(K.session, null);
    const th = storeGet(K.theme, "gold");

    setProducts(p);
    setUsers(u);
    setShifts(s);
    setAttendance(a);
    setTransactions(tx);
    setThemeKey(th);

    storeSet(K.products, p);
    storeSet(K.users, u);
    storeSet(K.shifts, s);

    if (sess) {
      const found = u.find((x) => x.id === sess);
      if (found) {
        setCurrentUser(found);
        setPage(found.role === "owner" ? "dashboard" : "kasir");
      }
    }
    setBooted(true);
  }, []);

  useEffect(() => { if (booted) storeSet(K.products, products); }, [products, booted]);
  useEffect(() => { if (booted) storeSet(K.users, users); }, [users, booted]);
  useEffect(() => { if (booted) storeSet(K.shifts, shifts); }, [shifts, booted]);
  useEffect(() => { if (booted) storeSet(K.attendance, attendance); }, [attendance, booted]);
  useEffect(() => { if (booted) storeSet(K.transactions, transactions); }, [transactions, booted]);
  useEffect(() => { if (booted) storeSet(K.theme, themeKey); }, [themeKey, booted]);

  function showToast(msg) {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 2200);
  }

  function handleLogin(u) {
    setCurrentUser(u);
    storeSet(K.session, u.id);
    setPage(u.role === "owner" ? "dashboard" : "kasir");
  }
  function handleLogout() {
    setCurrentUser(null);
    storeSet(K.session, null);
  }
  function handleCheckout(total) {
    const items = cart.map((c) => {
      const p = products.find((x) => x.id === c.productId);
      return { productId: p.id, name: p.name, qty: c.qty, price: p.price, cost: p.cost || 0 };
    });
    setProducts((prev) =>
      prev.map((p) => {
        const line = cart.find((c) => c.productId === p.id);
        return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
      })
    );
    setTransactions((prev) => [
      { id: uid(), timestamp: new Date().toISOString(), items, total, cashierId: currentUser.id, cashierName: currentUser.name },
      ...prev,
    ]);
    setCart([]);
    showToast("Transaksi selesai — " + rupiah(total));
  }

  const theme = THEMES[themeKey] || THEMES.gold;

  if (!booted) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: NEUTRAL.paper }}>
        <div className="text-sm" style={{ color: NEUTRAL.textMuted }}>
          Memuat Kasirku...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <ThemeCtx.Provider value={theme}>
        <LoginScreen users={users} onLogin={handleLogin} />
        <ThemeSwitcher themeKey={themeKey} setThemeKey={setThemeKey} />
      </ThemeCtx.Provider>
    );
  }

  const isOwner = currentUser.role === "owner";

  return (
    <ThemeCtx.Provider value={theme}>
      <div className="flex min-h-screen w-full overflow-x-hidden" style={{ background: NEUTRAL.paper, color: NEUTRAL.text }}>
        <Sidebar page={page} setPage={setPage} currentUser={currentUser} onLogout={handleLogout} isOwner={isOwner} />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopbar currentUser={currentUser} onLogout={handleLogout} isOwner={isOwner} />
          <main className="w-full max-w-[1220px] flex-1 p-4 pb-40 sm:p-6 sm:pb-36 lg:p-8 lg:pb-8">
            {page === "dashboard" && isOwner && (
              <PageDashboard products={products} users={users} shifts={shifts} attendance={attendance} transactions={transactions} />
            )}
            {page === "kasir" && <PageKasir products={products} cart={cart} setCart={setCart} currentUser={currentUser} onCheckout={handleCheckout} />}
            {page === "inventori" && <PageInventori products={products} setProducts={setProducts} />}
            {page === "absensi" && (
              <PageAbsensi shifts={shifts} attendance={attendance} setAttendance={setAttendance} currentUser={currentUser} />
            )}
            {page === "laporan" && isOwner && <PageLaporan products={products} transactions={transactions} />}
            {page === "team" && isOwner && <PageTeam users={users} setUsers={setUsers} shifts={shifts} setShifts={setShifts} />}
          </main>
        </div>
      </div>
      <BottomNav page={page} setPage={setPage} isOwner={isOwner} />
      <ThemeSwitcher themeKey={themeKey} setThemeKey={setThemeKey} />
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 z-[60] flex max-w-[90vw] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-[13.5px] font-medium text-white lg:bottom-6"
          style={{ background: theme.ink, boxShadow: "0 24px 60px rgba(0,0,0,.35)" }}
        >
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: theme.primary }} />
          {toast}
        </div>
      )}
    </ThemeCtx.Provider>
  );
}
