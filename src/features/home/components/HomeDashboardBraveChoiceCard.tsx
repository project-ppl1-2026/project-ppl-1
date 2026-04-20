"use client";

import { motion } from "framer-motion";
import { MotionCard, DonutRing } from "./home-dashboard-primitives";

export function HomeDashboardBraveChoiceCard({
  correct,
  total,
  pct,
  weekDelta,
}: {
  correct: number;
  total: number;
  pct: number;
  weekDelta: number;
}) {
  return (
    <MotionCard custom={2} className="tt-dashboard-card rounded-[1.15rem] p-3">
      <div className="flex h-full flex-col ">
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.11em]"
          style={{ color: "var(--tt-dashboard-text-2)" }}
        >
          Brave Choice
        </p>

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 4 }}
            transition={{ duration: 0.22 }}
            className="relative flex items-center justify-center"
          >
            <DonutRing pct={pct} color="var(--tt-dashboard-warning)" />
            <span
              className="absolute text-[11px] font-black"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              {pct}%
            </span>
          </motion.div>

          <div className="flex flex-col justify-center">
            <p
              className="text-[18px] font-black leading-none"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              {correct}/{total}
            </p>
            <p
              className="mt-1 text-[12px] font-semibold"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              pilihan benar
            </p>

            <p
              className="mt-2 text-[9px] font-bold"
              style={{ color: "var(--tt-dashboard-success)" }}
            >
              ↑ +{weekDelta}% minggu ini
            </p>
          </div>
        </div>
      </div>
    </MotionCard>
  );
}
