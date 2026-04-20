"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MotionCard } from "./home-dashboard-primitives";
import type { WeekData } from "../types";

export function HomeDashboardParentReportCard({
  parentEmail,
  currentWeek,
  year,
}: {
  parentEmail: string | null;
  currentWeek?: WeekData;
  year: number;
}) {
  return (
    <MotionCard custom={3} className="tt-dashboard-card rounded-[1.15rem] p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.11em]"
            style={{ color: "var(--tt-dashboard-text-2)" }}
          >
            Laporan Orang Tua
          </p>

          {parentEmail ? (
            <motion.span
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-1 text-[10px] font-bold"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              <CheckCircle2 size={14} /> Terverifikasi
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
              Belum aktif
            </motion.span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <p
            className="truncate text-[12px] font-bold"
            style={{ color: "var(--tt-dashboard-text)" }}
          >
            {parentEmail ?? "Belum ada email orang tua"}
          </p>

          <p
            className="mt-1 text-[10px]"
            style={{ color: "var(--tt-dashboard-text-2)" }}
          >
            {parentEmail
              ? "Jadwal pengiriman laporan berikutnya"
              : "Tambahkan email untuk laporan mingguan"}
          </p>

          {parentEmail && currentWeek ? (
            <motion.div
              whileHover={{ x: 1 }}
              className="mt-5 flex items-center gap-2 text-[11px]"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              <span>
                Periode: {currentWeek.days[0]?.date ?? "-"} -{" "}
                {currentWeek.days[6]?.date ?? "-"}{" "}
                {currentWeek.days[6]?.month ?? ""} {year}
              </span>
            </motion.div>
          ) : (
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/profile/parent-report"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-bold text-white transition-shadow duration-300"
                style={{
                  background: "var(--tt-dashboard-button-bg)",
                  boxShadow: "0 8px 18px rgba(26,150,136,0.14)",
                }}
              >
                Tambah Email <ArrowRight size={11} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </MotionCard>
  );
}
