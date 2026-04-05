import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FloatingBubble,
  PolaroidCard,
  SectionLabel,
} from "./landing-primitives";

const heroImg1 =
  "https://images.unsplash.com/photo-1758272424285-32dde2c2548a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwZ2lybCUyMGpvdXJuYWxpbmclMjB3cml0aW5nJTIwcGVhY2VmdWwlMjBiZWRyb29tfGVufDF8fHx8MTc3NDkzMzA1MHww&ixlib=rb-4.1.0&q=80&w=400";
const heroImg2 =
  "https://images.unsplash.com/photo-1772724317387-7e763804b637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuJTIwZnJpZW5kcyUyMHNtaWxpbmclMjBoYXBweSUyMHN1cHBvcnRpdmUlMjBvdXRkb29yfGVufDF8fHx8MTc3NDkzMzA1MHww&ixlib=rb-4.1.0&q=80&w=400";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-linear-to-br from-teal-50 via-white to-sky-50 py-20">
      <FloatingBubble size={600} top="0%" left="60%" opacity={0.12} />
      <FloatingBubble
        size={400}
        bottom="8%"
        left="4%"
        opacity={0.1}
        color="#10b981"
      />
      <FloatingBubble
        size={250}
        top="30%"
        right="5%"
        opacity={0.08}
        color="#0d9488"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <div className="flex-1 space-y-7">
            <SectionLabel>Platform Refleksi Diri #1 untuk Remaja</SectionLabel>

            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              AI Diary untuk{" "}
              <span className="text-teal-600">Dukungan Emosional</span> &amp;{" "}
              <span className="text-teal-600">Keamanan Diri</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-slate-500 md:text-lg">
              Platform refleksi diri dan kesadaran emosional untuk usia 10–29
              tahun. Ceritakan harimu, lacak moodmu, dan tumbuh bersama bersama
              AI yang peduli.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="h-12 bg-teal-600 px-8 hover:bg-teal-700">
                  Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="h-12 px-8">
                Lihat Fitur
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {["10K+ Pengguna", "98% Puas", "100% Aman"].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-semibold text-slate-800">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative flex h-96 w-full max-w-md items-center justify-center">
              <div className="absolute right-0 top-[5%] z-10">
                <PolaroidCard
                  src={heroImg2}
                  label="Tumbuh bersama teman"
                  rotate={6}
                />
              </div>
              <div className="absolute bottom-0 left-0 z-20">
                <PolaroidCard
                  src={heroImg1}
                  label="Ceritakan harimu"
                  rotate={-5}
                />
              </div>

              <div className="absolute left-1/2 top-0 z-30 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl ring-1 ring-slate-100">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-green-50 text-green-500">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Mood Check-in
                  </p>
                  <p className="text-xs text-green-500">Streak 12 hari!</p>
                </div>
              </div>

              <div className="absolute bottom-8 right-0 z-30 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-100">
                <p className="mb-1 text-xs font-semibold text-slate-800">
                  Mood Hari Ini
                </p>
                <div className="flex gap-1.5">
                  {["😢", "😟", "😐", "🙂", "😄"].map((e, i) => (
                    <div
                      key={i}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                        i === 4
                          ? "bg-teal-50 ring-2 ring-teal-500 text-teal-600"
                          : "bg-slate-50"
                      }`}
                    >
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
