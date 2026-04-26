"use client";

import { motion } from "framer-motion";
import { MotionCard, DonutRing } from "./home-dashboard-primitives";

export function HomeDashboardBraveChoiceCard({
  correct,
  total,
  pct,
}: {
  correct: number;
  total: number;
  pct: number;
}) {
  return (
    <MotionCard custom={2} className="tt-dashboard-card rounded-[1.15rem] p-4">
      <div className="flex h-full flex-col">
        <p
          className="mb-1 text-[10px] font-bold uppercase tracking-[0.11em]"
          style={{ color: "var(--tt-dashboard-text-2)" }}
        >
          Brave Choice
        </p>

        <div className="flex flex-1 items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 4 }}
            transition={{ duration: 0.22 }}
            className="relative flex items-center justify-center"
          >
            <DonutRing
              pct={pct}
              color="var(--tt-dashboard-warning)"
              size={54}
              stroke={6}
            />
            <span
              className="absolute text-[13px] font-black"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              {pct}%
            </span>
          </motion.div>

          <div className="flex flex-col justify-center">
            <p
              className="text-[22px] font-black leading-none"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              {correct}/{total}
            </p>
            <p
              className="mt-1.5 text-[12px] font-bold"
              style={{ color: "var(--tt-dashboard-text-2)" }}
            >
              pilihan benar
            </p>
          </div>
        </div>
      </div>
    </MotionCard>
  );
}
