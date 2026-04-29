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
    <MotionCard custom={5} className="tt-dashboard-card rounded-[1.15rem] p-4">
      <p
        className="mb-1 text-[9px] font-bold uppercase tracking-[0.11em]"
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
        className="mt-3 w-fit"
      >
        <Link
          href="/baseline"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold"
          style={{ color: "var(--tt-dashboard-brand)" }}
        >
          Kerjakan kembali
          <ArrowRight size={12} />
        </Link>
      </motion.div>
    </MotionCard>
  );
}
