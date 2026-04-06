// src/app/(auth)/layout.tsx
//
// FIX: Navbar & Footer hanya di-render SEKALI di sini.
// Pastikan (main)/layout.tsx TIDAK ikut render Navbar/Footer
// agar tidak ada double render.
//
// Cara cek: buka src/app/(main)/layout.tsx
//   — jika ada <Navbar /> atau <Footer /> di sana, hapus.
//   — biarkan (main)/layout.tsx hanya berisi children saja.

import { Footer } from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // font-family di sini agar sama persis dengan landing page

    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-plus-jakarta )" }}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
