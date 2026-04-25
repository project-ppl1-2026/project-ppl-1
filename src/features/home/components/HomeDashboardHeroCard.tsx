"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { MotionCard } from "./home-dashboard-primitives";

type StreakDay = {
  day: string;
  score: number | null;
};

export function HomeDashboardHeroCard({
  currentStreak,
  longestStreak,
  totalDiaries,
  streakWeek,
  getMoodColor,
}: {
  currentStreak: number;
  longestStreak: number;
  totalDiaries: number;
  streakWeek: StreakDay[];
  getMoodColor: (score: number) => string;
}) {
  return (
    <MotionCard
      custom={1}
      className="rounded-[1.15rem] p-3"
      style={{
        background: "var(--tt-dashboard-hero-bg)",
        boxShadow: "var(--tt-dashboard-hero-shadow)",
      }}
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.11em] text-white/90">
        Mood Streak
      </p>

      <div className="mb-2.5 mt-4 flex items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.06, rotate: -6 }}
          transition={{ duration: 0.22 }}
          className="flex h-8 w-8 items-center justify-center rounded-lg"
        >
          <Flame
            size={32}
            className="text-[var(--tt-dashboard-warning)] drop-shadow-[0_0_10px_rgba(255,190,92,0.35)]"
          />
        </motion.div>

        <div>
          <div className="flex items-end gap-1">
            <span className="text-[34px] font-black leading-none text-white">
              {currentStreak}
            </span>
            <span className="pb-0.5 text-[13px] font-semibold text-white/75">
              Hari
            </span>
          </div>
        </div>
      </div>

      <div className="mb-2.5 mt-6 grid grid-cols-2 gap-1.5">
        <motion.div
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.14)" }}
          className="rounded-lg bg-white/10 px-2.5 py-2 text-center transition-colors duration-200"
        >
          <p className="text-[15px] font-black text-white">{longestStreak}</p>
          <p className="text-[10px] text-white/90">Terpanjang</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.14)" }}
          className="rounded-lg bg-white/10 px-2.5 py-2 text-center transition-colors duration-200"
        >
          <p className="text-[15px] font-black text-white">{totalDiaries}</p>
          <p className="text-[10px] text-white/90">Total Diary</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {streakWeek.map((d, i) => (
          <motion.div
            key={`${d.day}-${i}`}
            whileHover={{ y: -1 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="h-1.5 w-full rounded-full transition-all duration-200"
              style={{
                background:
                  d.score !== null
                    ? getMoodColor(d.score)
                    : "rgba(255,255,255,0.18)",
              }}
            />
            <span className="text-[6px] text-white/50">{d.day[0]}</span>
          </motion.div>
        ))}
      </div>
    </MotionCard>
  );
}
