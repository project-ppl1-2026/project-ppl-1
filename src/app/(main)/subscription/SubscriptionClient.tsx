"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SnapPayButton from "@/components/payment/SnapPayButton";

const PRICE_PER_MONTH = 59000;

const DURATION_OPTIONS = [
  { months: 1, label: "1 Bulan" },
  { months: 3, label: "3 Bulan" },
  { months: 6, label: "6 Bulan" },
  { months: 12, label: "12 Bulan" },
];

const basicFeatures = ["Mood check-in", "Diary harian", "Riwayat dasar"];

const premiumFeatures = [
  "Insight lengkap",
  "Tren mood",
  "Rekomendasi personal",
  "Akses premium",
];

type SubscriptionInfo = {
  startedAt: string;
  expiresAt: string;
  isActive: boolean;
} | null;

type PendingPaymentInfo = {
  id: string;
  orderId: string;
  token: string;
  durationMonths: number;
  grossAmount: string;
  status: string;
  createdAt: string;
} | null;

export default function SubscriptionClient({
  isPremium,
  subscription,
  pendingPayment,
  midtransClientKey,
  midtransIsProduction,
}: {
  isPremium: boolean;
  subscription: SubscriptionInfo;
  pendingPayment: PendingPaymentInfo;
  midtransClientKey: string;
  midtransIsProduction: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const checkoutDuration = pendingPayment?.durationMonths ?? selectedDuration;
  const totalPrice = pendingPayment
    ? Number(pendingPayment.grossAmount)
    : PRICE_PER_MONTH * selectedDuration;

  const handleCancelPending = useCallback(async () => {
    setCancelLoading(true);
    setCancelError(null);

    try {
      const res = await fetch("/api/payment/cancel", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setCancelError(data.error || "Gagal membatalkan pembayaran.");
        return;
      }

      router.refresh();
      router.push("/subscription");
    } catch {
      setCancelError("Terjadi kesalahan jaringan.");
    } finally {
      setCancelLoading(false);
    }
  }, [router]);

  return (
    <main
      className="tt-dashboard-scroll-y h-full min-h-0 px-3 py-4 md:px-5 md:py-5"
      style={{ background: "var(--tt-dashboard-page-bg)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-4">
        {/* Status message */}
        {status === "success" && (
          <div
            className="rounded-[16px] px-5 py-4 text-[14px] font-semibold"
            style={{
              background: "var(--tt-dashboard-success-soft)",
              color: "var(--tt-dashboard-success)",
              border: "1px solid rgba(26,150,136,0.18)",
            }}
          >
            Pembayaran berhasil! Premium kamu sudah aktif.
          </div>
        )}

        {status === "pending" && (
          <div
            className="rounded-[16px] px-5 py-4 text-[14px] font-semibold"
            style={{
              background: "#FFF8F0",
              color: "#B4722A",
              border: "1px solid rgba(209,136,61,0.28)",
            }}
          >
            Pembayaran sedang diproses. Status akan diperbarui otomatis.
          </div>
        )}

        {pendingPayment && (
          <div
            className="rounded-[16px] px-5 py-4 text-[14px] font-semibold"
            style={{
              background: "#FFF8F0",
              color: "#B4722A",
              border: "1px solid rgba(209,136,61,0.28)",
            }}
          >
            Ada pembayaran {pendingPayment.durationMonths} bulan yang masih
            tertunda. Selesaikan atau batalkan pembayaran ini sebelum memilih
            durasi lain.
          </div>
        )}

        {/* Header */}
        <section className="tt-dashboard-card rounded-[28px] px-5 py-6 md:px-7 md:py-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p
                className="text-[10px] font-extrabold uppercase tracking-[0.16em]"
                style={{ color: "var(--tt-dashboard-text-3)" }}
              >
                Subscription
              </p>

              <h1
                className="mt-2 text-[28px] font-extrabold leading-tight md:text-[38px]"
                style={{ color: "var(--tt-dashboard-text)" }}
              >
                {isPremium ? "Premium aktif" : "Upgrade ke Premium!"}
              </h1>

              <p
                className="mt-2 max-w-[640px] text-[13px] leading-6 md:text-[14px]"
                style={{ color: "var(--tt-dashboard-text-2)" }}
              >
                {isPremium
                  ? "Semua fitur utama sudah terbuka."
                  : "Buka pengalaman yang lebih lengkap untuk refleksi harianmu."}
              </p>

              {isPremium && subscription && (
                <p
                  className="mt-3 text-[13px] font-medium"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  Aktif hingga:{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--tt-dashboard-brand)" }}
                  >
                    {new Date(subscription.expiresAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </span>
                </p>
              )}
            </div>

            <div
              className="inline-flex h-fit items-center rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{
                background: isPremium
                  ? "var(--tt-dashboard-success-soft)"
                  : "var(--tt-dashboard-brand-soft)",
                color: isPremium
                  ? "var(--tt-dashboard-success)"
                  : "var(--tt-dashboard-brand)",
              }}
            >
              {isPremium ? "Premium Aktif" : "Direkomendasikan"}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <PlanCard
            title="Basic"
            subtitle="Pakai gratis"
            active={!isPremium}
            subdued
            features={basicFeatures}
            footer={
              !isPremium ? (
                <div
                  className="flex h-12 items-center justify-center rounded-[16px] text-[13px] font-semibold"
                  style={{
                    background: "var(--tt-dashboard-brand-soft)",
                    color: "var(--tt-dashboard-text-2)",
                    border: "1px solid var(--tt-dashboard-card-border)",
                  }}
                >
                  Paket saat ini
                </div>
              ) : (
                <div
                  className="flex h-12 items-center justify-center rounded-[16px] text-[13px] font-semibold"
                  style={{
                    background: "#FFFFFF",
                    color: "var(--tt-dashboard-text-3)",
                    border: "1px solid var(--tt-dashboard-card-border)",
                  }}
                >
                  Paket dasar
                </div>
              )
            }
          />

          <PlanCard
            title="Premium"
            subtitle="Lebih lengkap"
            active={isPremium}
            featured
            features={premiumFeatures}
            footer={
              <div className="space-y-4">
                {/* Duration selector */}
                <div>
                  <p
                    className="mb-2 text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--tt-dashboard-text-3)" }}
                  >
                    {isPremium ? "Perpanjang Durasi" : "Pilih Durasi"}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.months}
                        type="button"
                        onClick={() => {
                          if (!pendingPayment) {
                            setSelectedDuration(opt.months);
                          }
                        }}
                        disabled={pendingPayment !== null}
                        className="rounded-[12px] px-2 py-2.5 text-[12px] font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55"
                        style={{
                          background:
                            checkoutDuration === opt.months
                              ? "rgba(26,150,136,0.14)"
                              : "rgba(26,150,136,0.04)",
                          color:
                            checkoutDuration === opt.months
                              ? "var(--tt-dashboard-brand)"
                              : "var(--tt-dashboard-text-2)",
                          border:
                            checkoutDuration === opt.months
                              ? "1.5px solid rgba(26,150,136,0.3)"
                              : "1.5px solid transparent",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <p
                    className="mt-2 text-[13px] font-semibold"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    Total: Rp {totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>

                {pendingPayment ? (
                  <div className="space-y-2">
                    <SnapPayButton
                      durationMonths={pendingPayment.durationMonths}
                      pendingToken={pendingPayment.token}
                      clientKey={midtransClientKey}
                      isProduction={midtransIsProduction}
                      label="Lanjutkan Pembayaran Tertunda"
                      className="h-12 w-full rounded-[16px] text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:opacity-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "#F59E0B",
                        boxShadow: "0 12px 26px rgba(245,158,11,0.18)",
                      }}
                    />

                    <button
                      type="button"
                      onClick={handleCancelPending}
                      disabled={cancelLoading}
                      className="h-12 w-full rounded-[16px] bg-white text-[14px] font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        color: "#B45309",
                        border: "1px solid rgba(245,158,11,0.3)",
                      }}
                    >
                      {cancelLoading ? "Membatalkan..." : "Batalkan Pembayaran"}
                    </button>

                    {cancelError && (
                      <p className="text-center text-xs font-medium text-red-500">
                        {cancelError}
                      </p>
                    )}
                  </div>
                ) : (
                  <SnapPayButton
                    durationMonths={selectedDuration}
                    clientKey={midtransClientKey}
                    isProduction={midtransIsProduction}
                    label={
                      isPremium
                        ? `Perpanjang ${selectedDuration} Bulan`
                        : `Upgrade Premium ${selectedDuration} Bulan`
                    }
                    className="h-12 w-full rounded-[16px] text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:opacity-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "var(--gradient-brand-btn)",
                      boxShadow: "0 12px 26px rgba(26,150,136,0.18)",
                    }}
                  />
                )}
              </div>
            }
          />
        </section>
      </div>
    </main>
  );
}

function PlanCard({
  title,
  subtitle,
  active,
  features,
  footer,
  featured = false,
  subdued = false,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  features: string[];
  footer: React.ReactNode;
  featured?: boolean;
  subdued?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[28px] p-5 transition-all duration-200 hover:-translate-y-[2px] md:p-6 ${
        featured ? "" : "tt-dashboard-card"
      }`}
      style={
        featured
          ? {
              background:
                "linear-gradient(160deg, rgba(237,249,247,0.98) 0%, rgba(255,255,255,1) 60%, rgba(244,251,250,1) 100%)",
              border: "1px solid rgba(26,150,136,0.18)",
              boxShadow: "0 20px 46px rgba(26,150,136,0.12)",
            }
          : subdued
            ? {
                opacity: 0.98,
              }
            : undefined
      }
    >
      {featured ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{ border: "1px solid rgba(78,207,195,0.28)" }}
          />
          <div
            className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full blur-3xl"
            style={{ background: "rgba(26,150,136,0.10)" }}
          />
        </>
      ) : null}

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.14em]"
              style={{
                color: featured
                  ? "var(--tt-dashboard-brand)"
                  : "var(--tt-dashboard-text-3)",
              }}
            >
              {subtitle}
            </p>

            <h2
              className="mt-2 text-[28px] font-extrabold leading-none md:text-[34px]"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              {title}
            </h2>
          </div>

          {active ? (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{
                background: featured
                  ? "rgba(26,150,136,0.12)"
                  : "var(--tt-dashboard-chip-bg)",
                color: "var(--tt-dashboard-brand)",
              }}
            >
              Aktif
            </span>
          ) : null}
        </div>

        <div className="mt-6 space-y-2.5">
          {features.map((feature) => (
            <FeatureRow key={feature} text={feature} featured={featured} />
          ))}
        </div>

        <div className="mt-6">{footer}</div>
      </div>
    </section>
  );
}

function FeatureRow({
  text,
  featured = false,
}: {
  text: string;
  featured?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-[16px] px-3.5 py-3 transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_6px_16px_rgba(26,150,136,0.08)]"
      style={{
        background: featured
          ? "rgba(26,150,136,0.07)"
          : "rgba(26,150,136,0.04)",
        border: featured
          ? "1px solid rgba(26,150,136,0.10)"
          : "1px solid transparent",
      }}
    >
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{
          background: featured
            ? "rgba(26,150,136,0.14)"
            : "rgba(26,150,136,0.08)",
          color: "var(--tt-dashboard-brand)",
        }}
      >
        <span className="text-[11px] font-bold">✓</span>
      </div>

      <p
        className="text-[13px] font-medium"
        style={{
          color: featured
            ? "var(--tt-dashboard-text)"
            : "var(--tt-dashboard-text-2)",
        }}
      >
        {text}
      </p>
    </div>
  );
}
