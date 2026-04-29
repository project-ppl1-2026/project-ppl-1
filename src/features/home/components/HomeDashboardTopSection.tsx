"use client";

import { HomeDashboardHeroCard } from "./HomeDashboardHeroCard";
import { HomeDashboardBraveChoiceCard } from "./HomeDashboardBraveChoiceCard";
import { HomeDashboardParentReportCard } from "./HomeDashboardParentReportCard";
import { HomeDashboardInsightCard } from "./HomeDashboardInsightCard";
import { HomeDashboardBaselineCard } from "./HomeDashboardBaselineCard";
import type { BaselineResponse, WeekData } from "../types";

type StreakDay = {
  day: string;
  score: number | null;
};

export function HomeDashboardTopSection({
  currentStreak,
  longestStreak,
  totalDiaries,
  streakWeek,
  getMoodColor,
  braveChoice,
  parentEmail,
  currentWeek,
  year,
  isPremium,
  baseline,
  onInsightClick,
  onInsightKeyDown,
}: {
  currentStreak: number;
  longestStreak: number;
  totalDiaries: number;
  streakWeek: StreakDay[];
  getMoodColor: (score: number) => string;
  braveChoice: {
    pct: number;
    correct: number;
    total: number;
  };
  parentEmail: string | null;
  currentWeek?: WeekData;
  year: number;
  isPremium: boolean;
  baseline: BaselineResponse | null;
  onInsightClick: () => void;
  onInsightKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    /**
     * Layout reference: CoachPro dashboard
     * Left column  → hero card (streak) — fixed narrower width
     * Right column → 2×2 grid of stat cards
     * On mobile    → stacks vertically
     */
    <div className="grid gap-3 xl:grid-cols-[280px_1fr]">
      {/* ── Left: Hero streak card ── */}
      <HomeDashboardHeroCard
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        totalDiaries={totalDiaries}
        streakWeek={streakWeek}
        getMoodColor={getMoodColor}
      />

      {/* ── Right: 2×2 stat cards ── */}
      <div className="grid grid-cols-2 gap-3">
        <HomeDashboardBraveChoiceCard
          correct={braveChoice.correct}
          total={braveChoice.total}
          pct={braveChoice.pct}
        />

        <HomeDashboardParentReportCard
          parentEmail={parentEmail}
          currentWeek={currentWeek}
          year={year}
        />

        <HomeDashboardInsightCard
          isPremium={isPremium}
          onClick={onInsightClick}
          onKeyDown={onInsightKeyDown}
        />

        {baseline ? <HomeDashboardBaselineCard baseline={baseline} /> : <div />}
      </div>
    </div>
  );
}
