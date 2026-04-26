"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { InsightPageHeader } from "./InsightPageHeader";
import { InsightRecommendationSection } from "./InsightRecommendationSection";
import { InsightReflectionSection } from "./InsightReflectionSection";
import { InsightTrendSection } from "./InsightTrendSection";
import {
  getDateKeyInTimeZone,
  getTodayDateString,
  getUserTimeZone,
} from "../lib/insight-data";
import type { DayInsight } from "../lib/insight-types";
import {
  countStableDays,
  getAverageMood,
  getLowMood,
  getMonthData,
  getPeakMood,
} from "../lib/insight-utils";

export default function InsightPageContent() {
  const [timezone] = useState(() => getUserTimeZone());
  const [todayDate] = useState(() => getTodayDateString(timezone));
  const [selectedDate, setSelectedDate] = useState(() =>
    getTodayDateString(timezone),
  );
  const [insightMap, setInsightMap] = useState<
    Record<string, Omit<DayInsight, "date">>
  >({});
  const [moodMap, setMoodMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [insightRes, moodRes] = await Promise.all([
        fetch("/api/insight"),
        fetch(`/api/mood?timezone=${encodeURIComponent(timezone)}`),
      ]);

      if (insightRes.ok) {
        const { data } = await insightRes.json();
        setInsightMap(data || {});
      }

      if (moodRes.ok) {
        const { data } = await moodRes.json();
        const mappedMoods: Record<string, number> = {};
        if (Array.isArray(data)) {
          data.forEach(
            (mood: { createdAt: string | Date; moodScore: number }) => {
              const dateStr = getDateKeyInTimeZone(
                new Date(mood.createdAt),
                timezone,
              );
              mappedMoods[dateStr] = mood.moodScore;
            },
          );
        }
        setMoodMap(mappedMoods);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [timezone]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const availableDates = useMemo(() => {
    const dateSet = new Set<string>([
      ...Object.keys(insightMap),
      ...Object.keys(moodMap),
      todayDate,
    ]);
    return Array.from(dateSet).sort();
  }, [insightMap, moodMap, todayDate]);

  const currentIndex = availableDates.indexOf(selectedDate);
  const effectiveDate =
    availableDates[currentIndex] ?? availableDates[availableDates.length - 1];

  const selectedInsight = insightMap[effectiveDate];
  const hasInsight = Boolean(selectedInsight);
  const isToday = effectiveDate === todayDate;
  const canGenerateToday = !hasInsight;

  const selectedDateObj = useMemo(
    () => new Date(`${effectiveDate}T00:00:00`),
    [effectiveDate],
  );

  const selectedYear = selectedDateObj.getFullYear();
  const selectedMonth = selectedDateObj.getMonth();

  const trendData = useMemo(
    () => getMonthData(selectedYear, selectedMonth, moodMap),
    [selectedYear, selectedMonth, moodMap],
  );

  const avgMood = useMemo(() => getAverageMood(trendData), [trendData]);
  const peakMood = useMemo(() => getPeakMood(trendData), [trendData]);
  const lowMood = useMemo(() => getLowMood(trendData), [trendData]);
  const stableDays = useMemo(() => countStableDays(trendData), [trendData]);
  const hasTrendData = trendData.some((item) => item.mood !== null);

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

  async function handleGenerateTodayInsight() {
    if (!canGenerateToday || isGenerating) return;

    try {
      setIsGenerating(true);
      const res = await fetch("/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: effectiveDate, timezone }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Gagal menghasilkan Insight.");
        return;
      }

      toast.success("Insight berhasil dihasilkan untuk hari ini!");
      // Refetch insights to get the new data
      await fetchData();
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsGenerating(false);
    }
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
            isGenerating={isGenerating}
            onGenerateTodayInsight={handleGenerateTodayInsight}
            onPrevDate={handlePrevDate}
            onNextDate={handleNextDate}
            onDateChange={handleDateChange}
          />

          {isLoading || isGenerating ? (
            <div className="flex flex-col gap-4 mt-4 w-full">
              <div className="h-[460px] w-full rounded-[32px] bg-slate-200/50 animate-pulse" />
              <div className="h-[360px] w-full rounded-[32px] bg-slate-200/50 animate-pulse" />
              <div className="h-[200px] w-full rounded-[32px] bg-slate-200/50 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 mt-4">
                <InsightTrendSection
                  selectedMonth={selectedMonth}
                  hasTrendData={hasTrendData}
                  trendData={trendData}
                  peakMood={peakMood}
                  lowMood={lowMood}
                  avgMood={avgMood}
                  stableDays={stableDays}
                />

                <InsightReflectionSection
                  effectiveDate={effectiveDate}
                  availableDates={availableDates}
                  isToday={isToday}
                  selectedInsight={selectedInsight}
                />
              </div>

              <InsightRecommendationSection selectedInsight={selectedInsight} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
