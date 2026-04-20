"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BASE_INSIGHT_BY_DATE,
  buildGeneratedInsight,
  TODAY_DATE,
} from "./insight-data";
import {
  countStableDays,
  getAverageMood,
  getLowMood,
  getMonthData,
  getPeakMood,
} from "./insight-utils";
import type { DayInsight } from "./insight-types";
import { InsightPageHeader } from "./InsightPageHeader";
import { InsightReflectionSection } from "./InsightReflectionSection";
import { InsightTrendSection } from "./InsightTrendSection";
import { InsightRecommendationSection } from "./InsightRecommendationSection";

export default function InsightPageContent() {
  const [generatedInsightMap, setGeneratedInsightMap] = useState<
    Record<string, Omit<DayInsight, "date">>
  >({});
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tt-generated-daily-insight-map");
      if (raw) {
        setGeneratedInsightMap(JSON.parse(raw));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "tt-generated-daily-insight-map",
        JSON.stringify(generatedInsightMap),
      );
    } catch {}
  }, [generatedInsightMap]);

  const mergedInsightMap = useMemo(
    () => ({
      ...BASE_INSIGHT_BY_DATE,
      ...generatedInsightMap,
    }),
    [generatedInsightMap],
  );

  const availableDates = useMemo(() => {
    const dateSet = new Set<string>([
      ...Object.keys(BASE_INSIGHT_BY_DATE),
      ...Object.keys(generatedInsightMap),
      TODAY_DATE,
    ]);
    return Array.from(dateSet).sort();
  }, [generatedInsightMap]);

  const [selectedDate, setSelectedDate] = useState(TODAY_DATE);

  const currentIndex = availableDates.indexOf(selectedDate);
  const effectiveDate =
    availableDates[currentIndex] ?? availableDates[availableDates.length - 1];

  const selectedInsight = mergedInsightMap[effectiveDate];
  const hasInsight = Boolean(selectedInsight);
  const isToday = effectiveDate === TODAY_DATE;
  const canGenerateToday = isToday && !hasInsight;

  const selectedDateObj = useMemo(
    () => new Date(`${effectiveDate}T00:00:00`),
    [effectiveDate],
  );

  const selectedYear = selectedDateObj.getFullYear();
  const selectedMonth = selectedDateObj.getMonth();

  const trendData = useMemo(
    () => getMonthData(selectedYear, selectedMonth, mergedInsightMap),
    [selectedYear, selectedMonth, mergedInsightMap],
  );

  const avgMood = useMemo(() => getAverageMood(trendData), [trendData]);
  const peakMood = useMemo(() => getPeakMood(trendData), [trendData]);
  const lowMood = useMemo(() => getLowMood(trendData), [trendData]);
  const stableDays = useMemo(() => countStableDays(trendData), [trendData]);

  function handlePrevDate() {
    if (currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1]);
    }
  }

  function handleNextDate() {
    if (currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1]);
    }
  }

  function handleDateChange(newDate: string) {
    if (!newDate) return;
    setSelectedDate(newDate);
  }

  function handleGenerateTodayInsight() {
    if (!canGenerateToday) return;

    setGeneratedInsightMap((prev) => ({
      ...prev,
      [TODAY_DATE]: buildGeneratedInsight(),
    }));
  }

  return (
    <main
      className="h-full min-h-0 overflow-hidden px-4 py-4 md:px-6 md:py-6 xl:px-8"
      style={{ background: "var(--tt-dashboard-page-bg)" }}
    >
      <div className="tt-dashboard-scroll-y mx-auto h-full pl-4 pr-2.5 py-2.5 max-w-[1320px] overflow-y-auto pr-1">
        <div className="pb-6">
          <InsightPageHeader
            effectiveDate={effectiveDate}
            availableDates={availableDates}
            currentIndex={currentIndex}
            dateInputRef={dateInputRef}
            isToday={isToday}
            hasInsight={hasInsight}
            onGenerateTodayInsight={handleGenerateTodayInsight}
            onPrevDate={handlePrevDate}
            onNextDate={handleNextDate}
            onDateChange={handleDateChange}
          />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-stretch">
            <InsightReflectionSection
              effectiveDate={effectiveDate}
              availableDates={availableDates}
              selectedInsight={selectedInsight}
            />

            <InsightTrendSection
              selectedMonth={selectedMonth}
              hasInsight={hasInsight}
              trendData={trendData}
              peakMood={peakMood}
              lowMood={lowMood}
              avgMood={avgMood}
              stableDays={stableDays}
            />
          </div>

          <InsightRecommendationSection selectedInsight={selectedInsight} />
        </div>
      </div>
    </main>
  );
}
