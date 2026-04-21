"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionCard } from "./home-dashboard-primitives";
import type { BaselineResponse } from "../types";

type HomeDashboardBaselineCardProps = {
  baseline: BaselineResponse | null;
};

export function HomeDashboardBaselineCard({
  baseline,
}: HomeDashboardBaselineCardProps) {
  if (!baseline) return null;

  return (
    <MotionCard custom={5} className="tt-dashboard-card rounded-[1.15rem] p-3">
      <p
        className="mb-1 text-[8px] font-bold uppercase tracking-[0.11em]"
        style={{ color: "var(--tt-dashboard-text-2)" }}
      >
        LEVEL {baseline.isBeginner ? "BEGINNER" : "INTERMEDIATE"}
      </p>

      <p
        className="text-[14px] font-extrabold"
        style={{ color: "var(--tt-dashboard-text)" }}
      >
        Baseline Assessment
      </p>

      <motion.div
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className="w-fit"
      >
        <Link
          href="/baseline"
          className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold"
          style={{ color: "var(--tt-dashboard-text)" }}
        >
          Kerjakan kembali Baseline Assessment
          <ArrowRight size={13} />
        </Link>
      </motion.div>
    </MotionCard>
  );
}
