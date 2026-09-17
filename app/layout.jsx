import "./globals.css";

export const metadata = {
  title: "Kasirku — Kasir, Stok, Shift & Absensi",
  description:
    "Aplikasi kasir, inventori, shift, dan absensi wajah untuk toko Anda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
        <script
          data-goatcounter="https://kasirku-abi.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        ></script>
      </body>
    </html>
  );
}
