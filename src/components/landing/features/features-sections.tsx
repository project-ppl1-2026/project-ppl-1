"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturesOverview() {
  return (
    <section className="bg-page-bg0 py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[10px] font-extrabold tracking-widest text-brand-teal uppercase mb-3">
          4 Fitur Unggulan
        </p>
        <h2 className="font-black text-3xl lg:text-4xl text-text-brand-primary tracking-tight mb-4">
          Dirancang untuk Perjalananmu
        </h2>
        <p className="text-base text-text-brand-secondary font-sans max-w-2xl mx-auto leading-relaxed">
          Setiap fitur saling melengkapi — dari refleksi harian hingga wawasan
          mendalam berbasis AI.
        </p>
      </div>
    </section>
  );
}

export function FeaturesDiary() {
  return (
    <section className="bg-white py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 rounded-full bg-page-bg1 text-brand-teal-dark text-[10px] font-extrabold tracking-widest mb-6">
              01 · SAFE DIARY
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-text-brand-primary tracking-tight mb-6">
              Diary yang Benar-Benar Mengerti Perasaanmu
            </h2>
            <p className="text-text-brand-secondary leading-relaxed font-sans mb-8 text-base/7">
              Tidak seperti diary biasa, Safe Diary menggunakan AI percakapan
              yang mampu memvalidasi, memahami, dan memberikan perspektif baru —
              tanpa menghakimi. Setiap entri dienkripsi end-to-end.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-brand-teal-dark font-medium">
              {[
                "Respons empatik real-time dari AI Teman",
                "Mode refleksi terpandu dengan pertanyaan Socratic",
                "Semua isi diary hanya bisa dibaca kamu sendiri",
                "Tidak ada data yang dibagikan ke pihak ketiga",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />{" "}
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/diary">
              <Button
                size="lg"
                className="bg-brand-teal hover:bg-brand-teal-mid text-white rounded-xl gap-2 font-bold px-8 h-12"
              >
                Coba Safe Diary <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex-1 w-full relative">
            <div className="relative rounded-3xl bg-page-bg1 border-2 border-brand-border p-8 flex flex-col gap-4 shadow-xl">
              <div className="w-full bg-teal-800 text-white rounded-t-2xl rounded-bl-2xl p-4 text-sm font-medium ml-auto max-w-[85%] shadow-md">
                Halo Clarisya! ✨ Bagaimana harimu dimulai?
              </div>
              <div className="w-full bg-page-bg1 text-text-brand-primary border border-brand-border rounded-t-2xl rounded-br-2xl p-4 text-sm font-sans max-w-[85%] shadow-sm">
                Lumayan, tapi agak cemas soal presentasi.
              </div>
              <div className="w-full bg-teal-800 text-white rounded-t-2xl rounded-bl-2xl p-4 text-sm font-medium ml-auto max-w-[85%] shadow-md">
                Cemas itu tandamu peduli. Apa yang sudah kamu siapkan?
              </div>
              <div className="w-full bg-page-bg1 text-text-brand-primary border border-brand-border rounded-t-2xl rounded-br-2xl p-4 text-sm font-sans max-w-[85%] shadow-sm">
                Slide-nya sudah, tapi takut blank di tengah2.
              </div>
              <div className="w-full bg-teal-800 text-white rounded-t-2xl rounded-bl-2xl p-4 text-sm font-medium ml-auto max-w-[85%] shadow-md">
                Tarik napas — satu langkah kecil: ingat satu fakta kunci yang
                kamu hafal. Itu anchor-mu ⚓
              </div>
              <div className="mt-4 pt-4 border-t border-teal-200/50 flex gap-2">
                <div className="flex-1 bg-white border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-teal-dark/50 flex items-center">
                  Ceritakan harimu...
                </div>
                <div className="w-12 h-12 bg-brand-teal text-white rounded-xl flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesBraveChoice() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selectedOption === null) {
      setSelectedOption(index);
    }
  };

  return (
    <section className="bg-orange-50/30 py-24 px-6 lg:px-16 border-t border-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 rounded-full bg-page-bg1 text-brand-teal-dark text-[10px] font-extrabold tracking-widest mb-6">
              02 · BRAVE CHOICE
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-text-brand-primary tracking-tight mb-6">
              Latih Keberanianmu dalam Situasi Nyata
            </h2>
            <p className="text-text-brand-secondary leading-relaxed font-sans mb-8 text-base/7">
              Brave Choice menyajikan skenario sosial nyata dirancang bersama
              psikolog. Kamu berlatih membuat keputusan emosional yang sehat,
              berani, dan berempati — dalam lingkungan yang aman.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-brand-teal-dark font-medium">
              {[
                "150+ skenario sosial berbasis riset psikologi remaja",
                "Feedback instan dengan penjelasan mengapa pilihanmu tepat",
                "Skor Brave Choice yang meningkat seiring latihan",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />{" "}
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/brave-choice">
              <Button
                size="lg"
                className="bg-brand-teal hover:bg-brand-teal-mid text-white rounded-xl gap-2 font-bold px-8 h-12"
              >
                Coba Brave Choice <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-brand-teal-dark rounded-3xl p-8 shadow-xl text-white relative overflow-hidden border border-brand-teal-mid">
              <div className="absolute top-0 left-0 w-full h-2 bg-page-bg10" />
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-md bg-teal-800/80 text-xs font-bold font-sans">
                  BRAVE CHOICE
                </span>
                <span className="px-3 py-1 rounded-md bg-teal-800/80 text-xs font-medium opacity-80">
                  Skenario 14
                </span>
              </div>
              <h3 className="text-xl font-medium font-sans leading-relaxed mb-10 text-teal-50">
                &quot;Temanmu meminjam uangmu dan belum mengembalikannya. Kamu
                butuh uang itu sekarang.&quot;
              </h3>
              <p className="text-xs uppercase tracking-widest text-teal-400 font-bold mb-4">
                PILIH RESPONSMU:
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelect(0)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all font-medium text-sm border-2 ${
                    selectedOption === null
                      ? "bg-white text-text-brand-primary border-transparent hover:bg-page-bg1"
                      : selectedOption === 0
                        ? "bg-brand-teal-ghost text-brand-teal-dark border-brand-teal shadow-sm"
                        : "bg-white text-text-brand-primary opacity-60 border-transparent"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      selectedOption === 0
                        ? "border-brand-teal bg-brand-teal-light text-white"
                        : "border-teal-200"
                    }`}
                  >
                    {selectedOption === 0 && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                  </div>
                  Ajak dia bicara baik-baik dan jujur.
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect(1)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all font-medium text-sm border-2 ${
                    selectedOption === null
                      ? "bg-white text-text-brand-primary border-transparent hover:bg-page-bg1"
                      : selectedOption === 1
                        ? "bg-red-50 text-red-900 border-red-500 shadow-sm"
                        : "bg-white text-text-brand-primary opacity-60 border-transparent"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      selectedOption === 1
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-brand-border"
                    }`}
                  >
                    {selectedOption === 1 && <X className="w-3 h-3" />}
                  </div>
                  Diam dan tunggu dia yang duluan.
                </button>
              </div>

              {selectedOption !== null && (
                <div
                  className={`mt-5 p-4 rounded-xl text-sm font-medium transition-all ${
                    selectedOption === 0
                      ? "bg-emerald-900/40 text-brand-teal-ghost border border-brand-teal/30"
                      : "bg-red-900/40 text-red-100 border border-red-500/30"
                  }`}
                >
                  {selectedOption === 0
                    ? "✨ Benar! Komunikasi asertif dan jujur adalah kunci. Temanmu mungkin lupa tanpa berniat buruk."
                    : "❌ Kurang tepat. Menunggu tanpa kepastian hanya akan membangun asumsi negatif. Lebih baik dibicarakan."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesQuote() {
  return (
    <section className="py-24 px-6 lg:px-16 bg-[#1A2840] text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1772724317387-7e763804b637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')] bg-cover bg-center opacity-20 mix-blend-overlay" />
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight mb-6">
          &quot;Bukan tentang sempurna, <br className="hidden lg:block" />
          tapi tentang berani jujur dengan dirimu sendiri.&quot;
        </h2>
        <p className="text-teal-200/80 font-sans tracking-widest text-sm">
          — Filosofi TemanTumbuh
        </p>
      </div>
    </section>
  );
}

export function FeaturesPrivacy() {
  return (
    <section className="bg-white py-24 px-6 lg:px-16 border-t border-brand-border">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-page-bg1 text-brand-teal-dark text-[10px] font-extrabold tracking-widest mb-6">
          TRANSPARANSI ORANG TUA
        </span>
        <h2 className="text-3xl lg:text-4xl font-black text-text-brand-primary tracking-tight mb-6">
          Privasi Terjaga, Kepercayaan Terbangun
        </h2>
        <p className="text-text-brand-secondary leading-relaxed font-sans mb-16 text-base/7 max-w-2xl">
          Orang tua mendapatkan laporan perkembangan umum setiap minggu — tanpa
          melihat isi diary pribadi anak.
        </p>

        {/* Weekly Report Mockup */}
        <div className="w-full max-w-3xl border-2 border-brand-border rounded-3xl overflow-hidden shadow-lg bg-white text-left">
          <div className="bg-page-bg0 p-6 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-teal text-white rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-text-brand-primary">
                  Laporan Mingguan · TemanTumbuh
                </h4>
                <p className="text-xs text-brand-teal/70">
                  Dari: laporan@temantumbuh.id · Kepada: parent email
                </p>
              </div>
            </div>
            <div className="hidden sm:flex bg-brand-teal-ghost text-brand-teal-dark px-3 py-1 rounded-full text-xs font-bold items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Terverifikasi
            </div>
          </div>
          <div className="p-8 lg:p-10 space-y-6">
            <p className="text-xs font-medium text-brand-teal/60 tracking-wider">
              Rabu, 4 April 2026 · Laporan #12
            </p>
            <h3 className="text-2xl font-black text-text-brand-primary">
              Perkembangan Clarisya — Minggu Ini
            </h3>
            <p className="text-sm/6 text-brand-teal-dark/80 font-sans">
              Minggu ini, Clarisya menunjukkan pola keterlibatan yang positif
              dan konsisten. Ia secara aktif berpartisipasi dalam sesi refleksi
              harian dan menyelesaikan beberapa skenario pilihan emosional
              dengan tingkat pemikiran yang matang dan konstruktif.
            </p>
            <p className="text-sm/6 text-brand-teal-dark/80 font-sans">
              Secara keseluruhan, perkembangan minggu ini sangat menggembirakan.
              Pertahankan semangat dan dukungan positif darimu!
            </p>
            <div className="bg-page-bg1/80 border border-brand-border rounded-2xl p-5 flex gap-4 mt-8">
              <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
              <p className="text-xs/5 text-brand-teal-dark/70 font-medium">
                <span className="font-bold text-brand-teal-dark">
                  Catatan Privasi:
                </span>{" "}
                Laporan ini bersifat umum dan tidak mengandung isi diary pribadi
                Clarisya. Semua data AI terenkripsi spesifik tetap sepenuhnya
                terjaga kerahasiaannya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesCTA() {
  return (
    <section className="bg-brand-teal-dark py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-black text-3xl lg:text-4xl text-white tracking-tight mb-4">
          Siap Merasakan Semua Fiturnya?
        </h2>
        <p className="text-base lg:text-lg text-white/70 font-sans leading-relaxed mb-10">
          Bergabung gratis dan akses Safe Diary, Mood Check-In, serta Brave
          Choice sekarang juga.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button
              size="lg"
              className="h-14 px-8 rounded-2xl bg-white hover:bg-page-bg1 text-brand-teal-dark font-extrabold w-full sm:w-auto"
            >
              Mulai Gratis <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-2xl border-2 border-brand-teal-light hover:bg-brand-teal-mid text-brand-teal-light hover:text-white font-bold w-full sm:w-auto"
            >
              Lihat Harga
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
