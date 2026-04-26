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
    <div className="grid gap-2.5 xl:grid-cols-[0.86fr_2.14fr]">
      <HomeDashboardHeroCard
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        totalDiaries={totalDiaries}
        streakWeek={streakWeek}
        getMoodColor={getMoodColor}
      />

      <div className="grid gap-2.5 md:grid-cols-2">
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
