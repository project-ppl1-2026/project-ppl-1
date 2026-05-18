"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { MotionCard } from "./home-dashboard-primitives";
import type { WeekData } from "../types";

type ParentStatus = "pending" | "verified" | "expired" | null;
type ReportType = "free_summary" | "premium_pdf" | null;
type ReportStatus = "sent" | "failed" | null;

export function HomeDashboardParentReportCard({
  parentEmail,
  parentStatus,
  lastReportSentAt,
  lastReportType,
  lastReportStatus,
  currentWeek,
  year,
  timezone,
  onReportSent,
}: {
  parentEmail: string | null;
  parentStatus: ParentStatus;
  lastReportSentAt?: string | null;
  lastReportType?: ReportType;
  lastReportStatus?: ReportStatus;
  currentWeek?: WeekData;
  year: number;
  timezone: string;
  onReportSent?: () => Promise<void> | void;
}) {
  const [isSending, setIsSending] = useState(false);
  const isVerified = parentStatus === "verified" && Boolean(parentEmail);

  const lastSentLabel =
    lastReportStatus && lastReportSentAt
      ? new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(lastReportSentAt))
      : null;

  const reportTypeLabel =
    lastReportType === "premium_pdf"
      ? "PDF premium"
      : lastReportType === "free_summary"
        ? "Email ringkas"
        : null;

  const statusLabel =
    lastReportStatus === "failed"
      ? lastSentLabel
        ? `Gagal: ${lastSentLabel}`
        : "Gagal terkirim"
      : lastReportStatus === "sent" && lastSentLabel
        ? `Terakhir: ${lastSentLabel}`
        : "Belum pernah dikirim";

  const reportMetaLabel = reportTypeLabel
    ? `${statusLabel} - ${reportTypeLabel}`
    : statusLabel;
  const inactiveLabel =
    parentStatus === "pending"
      ? "Menunggu"
      : parentStatus === "expired"
        ? "Kedaluwarsa"
        : "Belum aktif";

  const handleSendReport = async () => {
    if (!isVerified || isSending) return;

    try {
      setIsSending(true);
      const res = await fetch("/api/parent-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone }),
      });
      const payload = (await res.json()) as {
        message?: string;
        error?: string;
        data?: {
          skipped?: boolean;
          reason?: string;
        };
      };

      if (!res.ok) {
        toast.error(payload.error || "Gagal mengirim laporan mingguan.");
        return;
      }

      if (payload.data?.skipped) {
        toast.info(payload.message || "Laporan tidak dikirim.");
      } else {
        toast.success(payload.message || "Laporan mingguan berhasil dikirim.");
      }
      await onReportSent?.();
    } catch {
      toast.error("Terjadi kesalahan saat mengirim laporan mingguan.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MotionCard custom={3} className="tt-dashboard-card rounded-[1.15rem] p-4">
      <div className="flex h-full flex-col">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <p
            className="text-[9px] font-bold uppercase tracking-[0.11em]"
            style={{ color: "var(--tt-dashboard-text-2)" }}
          >
            Laporan Orang Tua
          </p>

          {isVerified ? (
            <motion.span
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-1 text-[10px] font-bold"
              style={{ color: "var(--tt-dashboard-brand)" }}
            >
              <CheckCircle2 size={12} /> Terverifikasi
            </motion.span>
          ) : (
            <motion.span
              whileHover={{ scale: 1.04 }}
              className="rounded-full px-2 py-1 text-[9px] font-bold"
              style={{
                background: "var(--tt-dashboard-chip-bg)",
                color: "var(--tt-dashboard-chip-text)",
              }}
            >
              {inactiveLabel}
            </motion.span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p
              className="truncate text-[13px] font-bold leading-tight sm:text-[14px]"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              {parentEmail ?? "Belum ada email orang tua"}
            </p>

            <p
              className="mt-1 text-[11px] sm:text-[12px]"
              style={{ color: "var(--tt-dashboard-text-2)" }}
            >
              {isVerified
                ? reportMetaLabel
                : "Tambahkan email untuk laporan mingguan"}
            </p>
          </div>

          {isVerified && currentWeek ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div
                className="text-[11px] sm:text-[12px]"
                style={{ color: "var(--tt-dashboard-text)" }}
              >
                <div className="font-medium opacity-75">Periode</div>
                <div className="font-bold">
                  {currentWeek.days[0]?.date ?? "-"} -{" "}
                  {currentWeek.days[6]?.date ?? "-"}{" "}
                  {currentWeek.days[6]?.month ?? ""} {year}
                </div>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => void handleSendReport()}
                disabled={isSending}
                className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 text-[11px] font-bold text-white transition-shadow duration-300 disabled:cursor-not-allowed disabled:opacity-70 sm:text-[12px]"
                style={{
                  background: "var(--tt-dashboard-button-bg)",
                  boxShadow: "0 8px 18px rgba(26,150,136,0.14)",
                }}
              >
                {isSending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
                {isSending ? "Mengirim..." : "Kirim Sekarang"}
              </motion.button>
            </div>
          ) : (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href="/profile/parent-report"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-bold text-white transition-shadow duration-300 sm:text-[12px]"
                style={{
                  background: "var(--tt-dashboard-button-bg)",
                  boxShadow: "0 8px 18px rgba(26,150,136,0.14)",
                }}
              >
                Tambah Email <ArrowRight size={13} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </MotionCard>
  );
}
