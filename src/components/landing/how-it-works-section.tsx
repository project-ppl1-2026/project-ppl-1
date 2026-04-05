import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FloatingBubble, SectionHeader } from "./landing-primitives";

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <FloatingBubble size={350} top="5%" right="4%" opacity={0.06} />
      <FloatingBubble
        size={250}
        bottom="8%"
        left="4%"
        color="#10b981"
        opacity={0.06}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label="CARA KERJA"
          title="Bagaimana Cara Kerjanya?"
          description="Sederhana dan mudah digunakan oleh semua kalangan"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Teens Card */}
          <div className="relative overflow-hidden rounded-3xl bg-teal-600 p-8 space-y-5 shadow-[0px_16px_48px_rgba(13,148,136,0.25)]">
            <FloatingBubble
              size={250}
              top="8%"
              right="6%"
              color="white"
              opacity={0.06}
            />
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-1.5 text-xs font-bold tracking-wider text-white">
                UNTUK ANAK &amp; REMAJA
              </div>
              <h3 className="mb-4 mt-3 text-2xl font-bold text-white">
                Mulai dengan Diary Harian
              </h3>
              <ul className="space-y-3">
                {[
                  "Daftar gratis dalam 2 menit",
                  "Ceritakan harimu ke AI Diary",
                  "Jawab Brave Choice Trivia",
                  "Lihat perkembangan moodmu",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/25 text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <span className="text-sm text-white/90">{step}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="mt-6 flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-teal-600 shadow-[0px_4px_16px_rgba(0,0,0,0.12)] transition-all hover:opacity-90">
                  Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Parents Card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-linear-to-br from-[#FFF9EE] to-[#FFF3D6] p-8 space-y-5 shadow-[0px_8px_32px_rgba(245,158,11,0.18)]">
            <FloatingBubble
              size={250}
              bottom="10%"
              right="6%"
              color="#10b981"
              opacity={0.06}
            />
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5 text-xs font-bold tracking-wider text-amber-600">
                UNTUK ORANG TUA
              </div>
              <h3 className="mb-4 mt-1 text-2xl font-bold text-[#7C3503]">
                Pantau dengan Laporan Khusus
              </h3>
              <ul className="space-y-3">
                {[
                  "Terima undangan dari anak",
                  "Akses laporan mood mingguan",
                  "Pantau tren emosi tanpa privasi diary",
                  "Dapat notifikasi jika ada risiko",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/25 text-xs font-bold text-amber-600">
                      {i + 1}
                    </div>
                    <span className="text-sm text-[#7C3503]">{step}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 flex h-12 items-center gap-2 rounded-xl bg-amber-500 px-7 text-sm font-semibold text-white shadow-[0px_4px_16px_rgba(245,158,11,0.40)] transition-all hover:opacity-90">
                Pelajari Lebih Lanjut <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
