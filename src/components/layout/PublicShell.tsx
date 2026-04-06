// ============================================================
// src/components/layout/PublicShell.tsx
// Wrapper untuk halaman public
// ============================================================

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
