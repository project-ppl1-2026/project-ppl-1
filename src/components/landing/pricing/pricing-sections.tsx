"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  X as XIcon,
  Star,
  Crown,
  ArrowRight,
  ChevronDown,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const TABLE_ROWS = [
  {
    label: "Sesi Diary per Bulan",
    basic: "15 sesi",
    single: "Unlimited",
    highlight: true,
  },
  { label: "Mood Tracking Harian", basic: true, single: true },
  { label: "Brave Choice", basic: "5/hari", single: "Unlimited" },
  { label: "Laporan Email ke Orang Tua", basic: true, single: true },
  {
    label: "Insight Dashboard (Refleksi AI)",
    basic: false,
    single: true,
    highlight: true,
  },
  {
    label: "Rekomendasi Aksi Nyata (LLM)",
    basic: false,
    single: true,
    highlight: true,
  },
  { label: "Analisis Tren Emosi Bulanan", basic: false, single: true },
  { label: "Export Data Lengkap", basic: false, single: true },
  { label: "Priority Support", basic: false, single: true },
  { label: "Brave Choice Unlimited", basic: false, single: true },
];

const FAQS = [
  {
    q: "Apakah uji coba 7 hari benar-benar gratis?",
    a: "Ya! Tidak perlu memasukkan kartu kredit untuk memulai. Setelah 7 hari, kamu bisa memilih berlangganan atau kembali ke paket Basic secara gratis.",
  },
  {
    q: "Apakah isi diary saya aman dan privat?",
    a: "Sepenuhnya. Semua isi diary dienkripsi end-to-end dan tidak dapat diakses oleh siapapun, termasuk tim TemanTumbuh. Orang tua hanya menerima laporan umum non-personal.",
  },
  {
    q: "Bisakah saya upgrade atau downgrade kapan saja?",
    a: "Tentu! Kamu bisa upgrade ke Single Premium kapan saja, dan downgrade kembali ke Basic di akhir periode berlangganan tanpa penalti apapun.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "Kami menerima GoPay, OVO, QRIS, VISA, Mastercard, dan transfer bank BCA melalui Midtrans — gateway pembayaran terpercaya di Indonesia.",
  },
];

function PayBadge({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) {
  return (
    <div
      className={`h-6 px-2.5 rounded-md ${colorClass} flex items-center shadow-sm`}
    >
      <span className="text-[10px] font-black text-white tracking-wider">
        {label}
      </span>
    </div>
  );
}

function PRow({
  text,
  on = true,
  premium = false,
  highlight = false,
}: {
  text: string;
  on?: boolean;
  premium?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-4 py-2 border-b ${on ? "border-brand-border/50" : "border-transparent"}`}
    >
      <div className="shrink-0 mt-0.5">
        {on ? (
          <CheckCircle2
            className={`w-[18px] h-[18px] transition-colors ${premium ? "text-brand-teal-dark" : "text-brand-teal"}`}
          />
        ) : (
          <XIcon className="w-[18px] h-[18px] text-teal-200" />
        )}
      </div>
      <p
        className={`text-sm transition-colors ${
          on
            ? highlight
              ? "text-text-brand-primary font-semibold"
              : "text-brand-teal-dark"
            : "text-[#89a0a6] line-through decoration-teal-200"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl bg-white border-2 overflow-hidden mb-3 transition-colors ${open ? "border-brand-teal-pale shadow-sm" : "border-brand-border"}`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 bg-transparent border-none cursor-pointer flex justify-between items-center text-left"
      >
        <span className="font-bold text-[15px] text-text-brand-primary">
          {q}
        </span>
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors border ${
            open
              ? "bg-page-bg1 border-brand-teal-pale"
              : "bg-page-bg0 border-brand-border"
          }`}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <ChevronDown
              className={`w-4 h-4 transition-colors ${open ? "text-brand-teal-dark" : "text-[#89a0a6]"}`}
            />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-5">
              <p className="text-[14px] text-text-brand-secondary leading-relaxed font-sans">
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PricingContent() {
  const [annual, setAnnual] = useState(false);
  const monthly = 59000;
  const annPrice = 49000;
  const price = annual ? annPrice : monthly;

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-16 lg:py-24 flex flex-col items-center">
      {/* ── MODAL CARD (HEADER + CARDS) ── */}
      <div className="w-full bg-white rounded-[2rem] shadow-xl border border-brand-border overflow-hidden mb-12">
        {/* HEADER */}
        <div className="pt-12 pb-8 px-6 text-center relative bg-white">
          <h1 className="font-black text-3xl md:text-5xl text-text-brand-primary tracking-tight mb-4">
            Pilih Paket Pertumbuhanmu
          </h1>
          <p className="text-base text-brand-teal/80 font-sans max-w-xl mx-auto leading-relaxed mb-8">
            Mulai gratis, upgrade kapan saja. Semua paket mencakup keamanan data
            dan privasi penuh.
          </p>

          {/* BILLING TOGGLE */}
          <div className="inline-flex items-center p-1 rounded-xl bg-page-bg1 border border-brand-border">
            <button
              onClick={() => setAnnual(false)}
              className={`h-10 px-6 rounded-lg font-bold text-sm transition-all flex items-center ${
                !annual
                  ? "bg-white text-text-brand-primary shadow-sm border border-brand-teal-pale/50"
                  : "text-brand-teal hover:text-brand-teal-dark"
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`h-10 px-6 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                annual
                  ? "bg-white text-text-brand-primary shadow-sm border border-brand-teal-pale/50"
                  : "text-brand-teal hover:text-brand-teal-dark"
              }`}
            >
              Tahunan
              {annual && (
                <span className="text-[10px] font-black text-brand-teal-dark px-2 py-0.5 rounded-full bg-brand-teal-ghost border border-brand-teal-pale">
                  Hemat 17%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TWO PLAN CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-brand-border">
          {/* BASIC */}
          <div className="p-8 lg:p-10 flex flex-col border-b md:border-b-0 md:border-r border-brand-border bg-white">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-page-bg1 border border-brand-border mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider">
                  Starter
                </span>
              </div>
              <h2 className="font-black text-3xl text-text-brand-primary mb-2">
                Basic
              </h2>
              <p className="text-sm text-brand-teal/80 font-sans mb-6">
                Mulai perjalananmu tanpa biaya apapun.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-5xl text-text-brand-primary tracking-tight">
                  Rp 0
                </span>
                <span className="text-base font-medium text-brand-teal-mid">
                  / Selamanya
                </span>
              </div>
            </div>

            <div className="flex-1 mb-8">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#89a0a6] mb-4">
                YANG KAMU DAPATKAN
              </p>
              <PRow text="15 Sesi Diary per Bulan" on />
              <PRow text="Mood Tracking Harian" on />
              <PRow text="Laporan Email Paragraf ke Orang Tua" on />
              <PRow text="Akses Brave Choice Trivia (5/hari)" on />
              <div className="h-px bg-teal-100 my-4" />
              <PRow text="Insight Dashboard (Refleksi AI)" on={false} />
              <PRow text="Rekomendasi Aksi Nyata (LLM)" on={false} />
            </div>

            <div className="mt-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-14 rounded-xl border-2 border-teal-800 text-brand-teal-dark hover:bg-page-bg1 font-bold text-base"
                asChild
              >
                <Link href="/register">Gunakan Gratis</Link>
              </Button>
              <p className="text-xs text-center text-brand-teal-mid mt-3 font-medium">
                Tidak perlu kartu kredit
              </p>
            </div>
          </div>

          {/* SINGLE PREMIUM */}
          <div className="p-8 lg:p-10 flex flex-col bg-page-bg1 relative overflow-hidden group">
            {/* Glowing border effect */}
            <div className="absolute inset-0 border border-teal-300 pointer-events-none" />
            <div className="absolute -top-32 -right-16 w-64 h-64 rounded-full bg-teal-700/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white mb-4 shadow-md shadow-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  PALING DIREKOMENDASIKAN
                </span>
              </div>
              <h2 className="font-black text-3xl text-text-brand-primary mb-2">
                Single
              </h2>
              <p className="text-sm text-brand-teal/80 font-sans mb-6">
                Semua fitur premium, untuk satu pengguna.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-5xl text-text-brand-primary tracking-tight">
                  Rp {price.toLocaleString("id-ID")}
                </span>
                <span className="text-base font-medium text-brand-teal-mid">
                  / {annual ? "bln (tahunan)" : "Bulan"}
                </span>
              </div>
              {annual && (
                <p className="text-sm font-bold text-brand-teal-dark mt-2">
                  Hemat Rp {((monthly - annPrice) * 12).toLocaleString("id-ID")}{" "}
                  per tahun
                </p>
              )}
            </div>

            <div className="flex-1 relative z-10 mb-8">
              <p className="text-[10px] font-black tracking-widest uppercase text-brand-teal-dark mb-4">
                SEMUA DI BASIC, PLUS:
              </p>
              <PRow text="Unlimited Sesi Diary" on premium highlight />
              <PRow
                text="Insight Dashboard (Refleksi AI V3)"
                on
                premium
                highlight
              />
              <PRow
                text="Rekomendasi Aksi Nyata (LLM Analysis)"
                on
                premium
                highlight
              />
              <div className="h-px bg-teal-200/60 my-4" />
              <PRow text="Brave Choice Unlimited" on premium />
              <PRow text="Analisis Tren Emosi Bulanan" on premium />
              <PRow text="Export Data Lengkap" on premium />
              <PRow text="Priority Support" on premium />
            </div>

            <div className="relative z-10 mt-auto">
              <Button
                size="lg"
                className="w-full h-14 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white shadow-xl shadow-brand-teal/20 font-bold text-base gap-2 transition-all"
                asChild
              >
                <Link href="/register?plan=single">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{" "}
                  Coba Gratis 7 Hari <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <p className="text-xs text-center text-brand-teal mt-3 font-medium">
                Tidak perlu kartu kredit · Batalkan kapan saja
              </p>

              {/* PAYMENT BADGES */}
              <div className="mt-8 pt-6 border-t border-brand-teal-pale/50 flex flex-col items-center gap-4">
                <p className="text-[11px] font-bold text-brand-teal/70 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Powered by Midtrans —
                  Pembayaran Aman
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <PayBadge label="GoPay" colorClass="bg-sky-500" />
                  <PayBadge label="OVO" colorClass="bg-indigo-600" />
                  <PayBadge label="QRIS" colorClass="bg-red-600" />
                  <PayBadge label="BCA" colorClass="bg-blue-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL COMPARISON TABLE ── */}
      <div className="w-full mb-12">
        <h2 className="font-black text-2xl md:text-3xl text-text-brand-primary text-center mb-2">
          Perbandingan Lengkap
        </h2>
        <p className="text-sm text-brand-teal/80 font-sans text-center mb-8">
          Setiap baris dirancang agar transparan dan mudah dipahami.
        </p>

        <div className="rounded-2xl border-2 border-brand-border bg-white overflow-hidden shadow-xl shadow-brand-teal/5">
          {/* HEADER */}
          <div className="grid grid-cols-[1fr_80px_80px] md:grid-cols-[1fr_200px_200px] p-4 md:p-6 bg-page-bg1 border-b-2 border-brand-border items-center">
            <p className="text-xs font-bold text-brand-teal tracking-wider">
              FITUR
            </p>
            <p className="text-xs font-bold text-teal-700 tracking-wider text-center">
              BASIC
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xs font-black text-text-brand-primary tracking-wider">
                SINGLE
              </p>
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          {/* ROWS */}
          <div className="divide-y divide-teal-50">
            {TABLE_ROWS.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_80px_80px] md:grid-cols-[1fr_200px_200px] p-4 md:p-5 items-center transition-colors ${i % 2 === 0 ? "bg-white" : "bg-page-bg0"}`}
              >
                <p
                  className={`text-sm ${row.highlight ? "font-bold text-text-brand-primary" : "font-medium text-brand-teal-dark"}`}
                >
                  {row.label}
                </p>

                {/* Basic Value */}
                <div className="flex justify-center">
                  {typeof row.basic === "boolean" ? (
                    row.basic ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                    ) : (
                      <XIcon className="w-5 h-5 text-teal-200" />
                    )
                  ) : (
                    <span className="text-xs font-bold text-brand-teal/80 text-center">
                      {row.basic}
                    </span>
                  )}
                </div>

                {/* Single Value */}
                <div className="flex justify-center">
                  {typeof row.single === "boolean" ? (
                    row.single ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-teal-dark" />
                    ) : (
                      <XIcon className="w-5 h-5 text-teal-200" />
                    )
                  ) : (
                    <span className="text-xs font-black text-text-brand-primary text-center">
                      {row.single}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER CTA inside table */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 p-6 bg-white border-t-2 border-brand-border items-center justify-items-center md:justify-items-stretch">
            <p className="text-xs font-sans italic text-brand-teal/70 text-center md:text-left w-full">
              Harga dan fitur dapat berubah sewaktu-waktu.
            </p>
            <div className="flex justify-center w-full">
              <Button
                variant="outline"
                className="w-full max-w-[160px] border-2 border-teal-800 text-brand-teal-dark font-bold h-10 px-6 rounded-xl hover:bg-page-bg1"
                asChild
              >
                <Link href="/register">Mulai Gratis</Link>
              </Button>
            </div>
            <div className="flex justify-center w-full">
              <Button
                className="w-full max-w-[160px] bg-brand-teal text-white font-bold h-10 px-6 rounded-xl hover:bg-brand-teal-dark shadow-md shadow-brand-teal/20"
                asChild
              >
                <Link href="/register?plan=single">Coba 7 Hari</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── VISUAL CTA STRIP ── */}
      <div className="w-full rounded-3xl p-8 md:p-10 bg-brand-teal flex flex-col md:flex-row items-center justify-between gap-6 mb-16 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="text-center md:text-left relative z-10 w-full">
          <p className="font-black text-xl md:text-2xl text-white mb-2">
            Masih bimbang? Coba 7 hari dahulu.
          </p>
          <p className="text-sm text-white/80 font-sans">
            Tidak perlu kartu kredit. Batalkan kapan saja, tanpa syarat.
          </p>
        </div>
        <Button
          size="lg"
          className="w-full md:w-auto bg-white text-text-brand-primary hover:bg-page-bg1 font-black h-14 px-8 rounded-xl shadow-lg relative z-10 shrink-0"
          asChild
        >
          <Link href="/register?plan=single">Mulai Uji Coba Gratis</Link>
        </Button>
      </div>

      {/* ── FAQ ── */}
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="font-black text-2xl md:text-3xl text-text-brand-primary mb-3">
            Pertanyaan Umum
          </h2>
          <p className="text-sm text-brand-teal/80">
            Masih ada pertanyaan? Hubungi kami di support@temantumbuh.id
          </p>
        </div>

        <div className="space-y-1">
          {FAQS.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-page-bg0">
      {/* Blurred Blobs mapped to brand colors */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-teal-600/10 blur-3xl -top-32 -left-32" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl -bottom-32 -right-32" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-teal-300/10 blur-3xl top-1/3 right-0" />

      {/* Backdoor frosted glass */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40" />
    </div>
  );
}
