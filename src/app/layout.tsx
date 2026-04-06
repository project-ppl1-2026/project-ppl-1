// ============================================================
// src/app/layout.tsx
// Root layout — wrap semua halaman
// ============================================================

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import QueryProvider from "@/components/providers/query-providers";

// ─── Font ─────────────────────────────────────────────────────
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    template: "%s | TemanTumbuh",
    default: "TemanTumbuh — Tumbuh Bersama, Lebih Aman",
  },
  description:
    "Platform refleksi diri dan kesadaran sosial untuk usia 10–29 tahun.",
  keywords: ["kesehatan mental", "remaja", "refleksi diri", "emosi"],
};

// ─── Root Layout ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={plusJakartaSans.variable}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {/* Toast notification — global */}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              fontFamily: "var(--font-plus-jakarta)",
              borderRadius: "12px",
            },
          }}
        />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
