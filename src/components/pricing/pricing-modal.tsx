"use client";

import { X, Check, Star, TrendingUp } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  /** Whether the current user is already subscribed — read from session/user.isPremium */
  isPremium?: boolean;
  onSubscribe?: () => void;
}

export function PricingModal({
  open,
  onClose,
  isPremium = false,
  onSubscribe,
}: PricingModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,70,70,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-[2rem] overflow-hidden"
        style={{
          background: "#FEFCF8",
          boxShadow: "0 32px 80px rgba(13,70,70,0.22)",
          border: "1px solid #E2F0F0",
        }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#E2F0F0]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8AADAD] mb-1">
            TEMANTUMBUH · PLANS
          </p>
          <h2 className="text-2xl font-extrabold text-[#0D4646]">
            Buka Potensi Refleksi AI Kamu
          </h2>
          <p className="text-sm text-[#4A7070] mt-1">
            Pilih paket yang sesuai dengan perjalanan emosionalmu. Batalkan
            kapan saja – tanpa syarat.
          </p>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#E2F0F0] hover:bg-[#C8E8E8] transition-colors"
          >
            <X size={16} className="text-[#4A7070]" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Basic (Free) */}
          <div
            className="rounded-[1.5rem] p-6"
            style={{
              background: "#FFFFFF",
              border: `1.5px solid ${isPremium ? "#E2F0F0" : "#1B6B6B"}`,
            }}
          >
            <div className="mb-1 text-xs font-bold text-[#8AADAD] uppercase tracking-wider">
              Basic
            </div>
            <div className="text-3xl font-black text-[#0D4646] mb-1">
              Gratis
            </div>
            {!isPremium && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-[#059669] bg-[#D1FAE5] mb-5">
                <Check size={11} /> Paket Aktif
              </div>
            )}
            <div className={`space-y-3 ${!isPremium ? "" : "mt-5"}`}>
              {[
                "15 Sesi Diary / bulan",
                "Mood Tracking Harian",
                "Laporan Email Paragraf",
                "Brave Choice Standar",
              ].map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-[#4A7070]"
                >
                  <Check size={14} className="text-[#8AADAD] flex-shrink-0" />{" "}
                  {f}
                </div>
              ))}
            </div>
            <button
              className="mt-6 w-full py-3 rounded-[1rem] text-sm font-bold text-[#4A7070] cursor-default"
              style={{ background: "#F1F8F8", border: "1.5px solid #E2F0F0" }}
              disabled
            >
              {isPremium ? "Paket Dasar" : "Paket Kamu Saat Ini"}
            </button>
          </div>

          {/* Premium */}
          <div
            className="rounded-[1.5rem] p-6 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg,#0D4F4F 0%,#1B6B6B 50%,#1A9688 100%)",
              boxShadow: "0 16px 40px rgba(26,107,107,0.28)",
              border: isPremium ? "2px solid #10B981" : "none",
            }}
          >
            {!isPremium && (
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black text-[#0D4646] bg-[#F59E0B]">
                PALING POPULER
              </div>
            )}
            {isPremium && (
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black text-white bg-[#10B981]">
                AKTIF ✓
              </div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Single
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/20">
                <Star size={9} fill="#F59E0B" /> Premium
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-3xl font-black text-white">Rp 59.000</span>
              <span className="text-sm text-white/60">/bulan</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#34D399] font-semibold mb-5">
              <TrendingUp size={12} /> Hemat 40% dibanding layanan serupa
            </div>
            <div className="space-y-2.5">
              {[
                "Unlimited Diary Sesi",
                "Insight Dashboard (Refleksi AI V3)",
                "Priority Support Recommendation",
                "Laporan Email PDF",
                "Analisis Tren Emosi Bulanan",
              ].map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-white/90"
                >
                  <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </div>
                  {f}
                </div>
              ))}
            </div>
            {isPremium ? (
              <button
                onClick={onClose}
                className="mt-6 w-full py-3.5 rounded-[1rem] text-sm font-extrabold text-[#0D4646] transition-all hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg,#34D399,#10B981)",
                }}
              >
                Kamu Sudah Premium 🎉
              </button>
            ) : (
              <>
                <button
                  onClick={onSubscribe}
                  className="mt-6 w-full py-3.5 rounded-[1rem] text-sm font-extrabold text-[#0D4646] transition-all hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg,#34D399,#10B981)",
                  }}
                >
                  Berlangganan Sekarang
                </button>
                <p className="mt-2 text-center text-[10px] text-white/40">
                  Tidak perlu kartu kredit · Batalkan kapan saja
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
