// src/app/(main)/layout.tsx
//
// FIX: Navbar & Footer DIHAPUS dari sini.
// Masing-masing page group (main), (auth), dll.
// punya layout-nya sendiri yang sudah include Navbar + Footer.
//
// Jika sebelumnya layout ini punya <Navbar /> dan <Footer />,
// itulah penyebab Navbar tampil BERBEDA di halaman auth
// (karena Navbar di-render dua kali atau dari context yang berbeda).

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-plus-jakarta, sans-serif)" }}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
